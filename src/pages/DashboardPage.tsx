// src/pages/DashboardPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { Trash2, Undo2, Eye, Edit3, X, Search, ArrowDownUp, Layers, CheckCircle, FileText, MoreHorizontal, FilePlus2, LayoutGrid, BookOpenCheck } from 'lucide-react';
import ReactDOM from 'react-dom/client';
import DocumentPreview from '../components/DocumentPreview';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { API_BASE } from '../lib/apiBase';
import HeroBackground from '../components/ui/HeroBackground';

declare global {
  interface Window {
    htmlDocx: any;
  }
}

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const getEditPath = (title = '') => {
  // Map template titles to generator routes
  if (title.toLowerCase().includes('nda')) return '/documents/generate/nda';
  if (title.toLowerCase().includes('privacy')) return '/documents/generate/privacy-policy';
  if (title.toLowerCase().includes('refund')) return '/documents/generate/refund-policy';
  if (title.toLowerCase().includes('power of attorney')) return '/documents/generate/power-of-attorney';
  if (title.toLowerCase().includes('website services')) return '/documents/generate/website-services-agreement';
  if (title.toLowerCase().includes('cookies')) return '/documents/generate/cookies-policy';
  if (title.toLowerCase().includes('eula')) return '/documents/generate/eula';
  return '/generate';
};

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [templates, setTemplates] = useState<any[]>([]);
  const [trashedTemplates, setTrashedTemplates] = useState<any[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<{ open: boolean, template?: any }>({ open: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('az'); // 'az', 'za', 'newest', 'oldest'
  // const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number|null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadCompletedRef = useRef<boolean>(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Document stats
  const documentsCreated = templates.length + trashedTemplates.length;
  const documentsTrashed = trashedTemplates.length;
  const mostRecentDoc = templates.length > 0 ? templates[0] : null;
  const firstDoc = templates.length > 0 ? templates[templates.length - 1] : null;

  // Debug: Track loading state changes
  useEffect(() => {
    console.log('Loading state changed to:', loading, 'Templates count:', templates.length);
  }, [loading, templates.length]);

  // Debug: Track when dashboard component mounts/unmounts
  useEffect(() => {
    console.log('Dashboard component mounted/updated');
    return () => {
      console.log('Dashboard component will unmount');
    };
  }, []);

  // Optimized fetch templates helper with debouncing and parallel requests
  const fetchTemplates = async (userId: string, force = false) => {
    // For forced calls (like initial load or after document operations), skip debouncing
    if (!force) {
      const now = Date.now();
      if (now - lastFetchRef.current < 1000) { // Debounce for 1 second
        console.log('Debouncing fetchTemplates call');
        return;
      }
      lastFetchRef.current = now;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      console.log('Cancelling previous request');
      abortControllerRef.current.abort();
    }

    // Create new abort controller with timeout
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set timeout for requests (8 seconds max)
    const timeoutId = setTimeout(() => {
      console.log('Request timeout, aborting...');
      controller.abort();
    }, 8000);

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching templates for user:', userId);
      
      // Make both API calls in parallel for better performance
      const [activeResponse, trashedResponse] = await Promise.allSettled([
        fetch(`${API_BASE}/templates?user_id=${userId}`, { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }),
        fetch(`${API_BASE}/templates/trash?user_id=${userId}`, { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        })
      ]);

      // Clear timeout since requests completed
      clearTimeout(timeoutId);

      // Check if request was aborted
      if (controller.signal.aborted) {
        console.log('Request was aborted');
        return;
      }

      // Process active templates
      if (activeResponse.status === 'fulfilled' && activeResponse.value.ok) {
        const dataActive = await activeResponse.value.json();
        console.log('Active templates loaded:', dataActive.templates?.length || 0);
        setTemplates(dataActive.templates || []);
      } else {
        console.error('Failed to fetch active templates:', activeResponse);
        setTemplates([]);
        if (activeResponse.status === 'rejected') {
          throw new Error(`Failed to fetch active templates: ${activeResponse.reason}`);
        }
      }

      // Process trashed templates
      if (trashedResponse.status === 'fulfilled' && trashedResponse.value.ok) {
        const dataTrashed = await trashedResponse.value.json();
        console.log('Trashed templates loaded:', dataTrashed.templates?.length || 0);
        setTrashedTemplates(dataTrashed.templates || []);
      } else {
        console.warn('Failed to fetch trashed templates, setting empty array');
        setTrashedTemplates([]);
      }

      // Mark initial load as completed
      initialLoadCompletedRef.current = true;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted or timed out');
        // Don't set error for aborted requests, just return
        return;
      }
      
      console.error('Error fetching templates:', error);
      setError(error instanceof Error ? error.message : 'Failed to load documents');
      setTemplates([]);
      setTrashedTemplates([]);
    } finally {
      // Always clear loading state if the request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  };

  // Debounced version for frequent calls
  // const debouncedFetchTemplates = (userId: string) => {
  //   if (debounceTimeoutRef.current) {
  //     clearTimeout(debounceTimeoutRef.current);
  //   }
    
  //   debounceTimeoutRef.current = setTimeout(() => {
  //     fetchTemplates(userId, true);
  //   }, 300); // 300ms debounce
  // };

  useEffect(() => {
    console.log('Dashboard useEffect running - user:', user?.id, 'initialLoadCompleted:', initialLoadCompletedRef.current);
    
    if (!user) {
      console.log('No user found, skipping template fetch');
      setLoading(false); // Ensure loading is false when no user
      initialLoadCompletedRef.current = false;
      lastUserIdRef.current = null;
      return;
    }
    
    if (!user.id) {
      console.error('User object missing id property:', user);
      setError('User authentication error: missing user ID');
      setLoading(false); // Ensure loading is false on error
      return;
    }
    
    // Only fetch if:
    // 1. Initial load hasn't been completed for this user, OR
    // 2. User has changed
    const userChanged = lastUserIdRef.current !== user.id;
    const needsInitialLoad = !initialLoadCompletedRef.current || userChanged;
    
    console.log('needsInitialLoad:', needsInitialLoad, 'userChanged:', userChanged);
    
    if (needsInitialLoad) {
      console.log('Performing initial load for user:', user.id);
      lastUserIdRef.current = user.id;
      fetchTemplates(user.id, true); // Force initial load
      
      // Safety timeout to clear loading state if request hangs
      const safetyTimeout = setTimeout(() => {
        if (loading) {
          console.warn('Safety timeout: clearing loading state');
          setLoading(false);
          setError('Request timed out. Please try refreshing the page.');
        }
      }, 15000); // 15 seconds safety timeout

      return () => clearTimeout(safetyTimeout);
    } else {
      console.log('Skipping fetch - data already loaded for user:', user.id);
      // Ensure loading state is cleared when skipping fetch
      setLoading(false);
      setError(null);
    }
  }, [user]);

  // Only refresh when coming from document generation/edit pages
  useEffect(() => {
    // Skip if this is the initial load (handled by the previous useEffect)
    if (!user?.id || !location.state?.shouldRefreshDashboard) {
      return;
    }
    
    console.log('Refreshing templates after document operation...');
    fetchTemplates(user.id, true);
    
    // Clear the state to prevent repeated refreshes
    window.history.replaceState({}, document.title);
  }, [location.state, user?.id]); // Only depend on location.state, not the entire location object

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewDocument = (doc: any) => {
    setViewModal({ open: true, template: doc });
  };

  const handleEditDocument = (doc: any) => {
    const editPath = getEditPath(doc.title);
    navigate(editPath, { state: { template: doc } });
  };

  const handleDeleteDocument = async (docId: number) => {
    setPendingDeleteId(docId);
    setShowDeleteModal(true);
  };

  const confirmDeleteDocument = async () => {
    if (pendingDeleteId !== null) {
      await fetch(`${API_BASE}/templates/${pendingDeleteId}/trash`, { method: 'POST' });
      if (user) fetchTemplates(user.id, true); // Force immediate refresh
    }
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  };

  const cancelDeleteDocument = () => {
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  };

  const handleRestoreDocument = async (docId: number) => {
    await fetch(`${API_BASE}/templates/${docId}/restore`, { method: 'POST' });
    if (user) fetchTemplates(user.id, true); // Force immediate refresh
  };

  const handleDownloadDocument = async (doc: any, format: 'pdf' | 'docx') => {
    // Determine document type from title
    let typeKey = '';
    if (doc.title.toLowerCase().includes('privacy')) typeKey = 'privacyPolicy';
    else if (doc.title.toLowerCase().includes('nda')) typeKey = 'nda';
    else if (doc.title.toLowerCase().includes('refund')) typeKey = 'refundPolicy';
    else if (doc.title.toLowerCase().includes('power of attorney')) typeKey = 'powerOfAttorney';
    else if (doc.title.toLowerCase().includes('website services')) typeKey = 'websiteServicesAgreement';
    else if (doc.title.toLowerCase().includes('cookies')) typeKey = 'cookiesPolicy';
    else if (doc.title.toLowerCase().includes('eula')) typeKey = 'eula';
    else typeKey = 'generic';
    const data = JSON.parse(doc.content);
    if (format === 'docx' || format === 'pdf') {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.visibility = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.width = '800px'; // match your preview width
      container.style.left = '0';
      container.style.top = '0';
      document.body.appendChild(container);
      const root = ReactDOM.createRoot(container);

      // Debug: log data and typeKey
      console.log('DocumentPreview data:', data, 'typeKey:', typeKey);

      root.render(<DocumentPreview data={data} typeKey={typeKey} forDownload={true} />);
      setTimeout(async () => {
        // Debug: log HTML
        console.log('Container innerHTML:', container.innerHTML);

        // Get the actual preview node (first child)
        const previewNode = container.firstElementChild;

        if (format === 'docx') {
          let htmlDocx = window.htmlDocx;
          if (!htmlDocx) {
            htmlDocx = await new Promise((resolve) => {
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/html-docx-js/dist/html-docx.js';
              script.onload = () => resolve(window.htmlDocx);
              document.body.appendChild(script);
            });
          }
          const previewHTML = container.innerHTML;
          const docxHTML = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <style>
                  body { background: #fff; color: #222; font-family: serif; }
                  h2 { font-size: 24px; font-weight: 700; text-align: center; color: #3b82f6; margin-bottom: 8px; }
                  h3 { font-size: 16px; font-weight: 600; margin-top: 16px; }
                  p { text-align: justify; margin-bottom: 16px; }
                  div[style*='background: rgb(241, 245, 249)'] { background: #f1f5f9 !important; padding: 12px; border-radius: 6px; font-size: 14px; margin-bottom: 8px; }
                  /* Add any other styles your DocumentPreview uses here */
                </style>
              </head>
              <body>${previewHTML}</body>
            </html>
          `;
          const docxBlob = htmlDocx.asBlob(docxHTML);
          const a = document.createElement('a');
          a.href = URL.createObjectURL(docxBlob);
          a.download = `${doc.title}.docx`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            root.unmount();
            document.body.removeChild(container);
          }, 100);
        } else if (format === 'pdf') {
          await html2pdf().from(previewNode).set({
            filename: `${doc.title}.pdf`,
            margin: 0.5,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
          }).save();
          root.unmount();
          document.body.removeChild(container);
        }
      }, 1000); // Increase delay to 1 second
      return;
    }
  };

  const handleToggleMenu = (docId: number) => {
    setOpenMenuId(openMenuId === docId ? null : docId);
  }

  const handleActionClick = (action: () => void) => {
    action();
    setOpenMenuId(null);
  };

  // Filter and sort logic
  const filteredAndSortedTemplates = (showTrash ? trashedTemplates : templates)
    .filter(template => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        template.title.toLowerCase().includes(lowerSearch) ||
        (template.created_at && template.created_at.toLowerCase().includes(lowerSearch))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });

  // Test API connectivity
  // const testApiConnection = async () => {
  //   try {
  //     console.log('Testing API connection...');
  //     const response = await fetch(`${API_BASE}/test`);
  //     console.log('API test response status:', response.status);
  //     const data = await response.text();
  //     console.log('API test response data:', data);
  //     alert(`API Status: ${response.status}\nResponse: ${data}`);
  //   } catch (error) {
  //     console.error('API test failed:', error);
  //     alert(`API test failed: ${error}`);
  //   }
  // };

  // Test with mock data
  const testWithMockData = () => {
    console.log('Testing with mock data...');
    const mockDocuments = [
      {
        id: 1,
        title: 'Test NDA Document',
        content: JSON.stringify({
          partyOne: 'Test Company',
          partyTwo: 'Test Individual',
          effectiveDate: '2024-12-20',
          purpose: 'Testing purposes'
        }),
        created_at: '2024-12-20T10:00:00Z'
      },
      {
        id: 2,
        title: 'Test Privacy Policy',
        content: JSON.stringify({
          companyName: 'Test Corp',
          website: 'test.com',
          contactEmail: 'test@test.com',
          effectiveDate: '2024-12-20'
        }),
        created_at: '2024-12-19T15:30:00Z'
      }
    ];
    
    setTemplates(mockDocuments);
    setTrashedTemplates([]);
    setLoading(false);
    setError(null);
  };

  if (!user) {
    return <div className="py-8 text-center text-primary text-xl">Please sign in to view your dashboard.</div>;
  }

  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-primary mb-4">Move to Trash?</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to move this document to trash?</p>
            <div className="flex gap-4">
              <button
                onClick={confirmDeleteDocument}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-accent transition"
              >
                OK
              </button>
              <button
                onClick={cancelDeleteDocument}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        className="py-8"
      >
        {/* Hero Section (modern, animated) */}
        <motion.section
          variants={sectionVariants}
          className="w-full h-screen flex flex-col justify-center py-10 sm:py-16 bg-gradient-to-br from-primary to-accent text-white text-center overflow-hidden relative"
        >
          <HeroBackground variant="dashboard" />
          <div className="absolute inset-0 bg-black/20 z-0"></div>
          <div className="w-full relative z-10 flex flex-col justify-center h-full">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }} className="mb-8">
                <Layers size={72} className="mx-auto opacity-90 text-logoGreen" strokeWidth={1.5} />
              </motion.div>
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter"
                style={{ textShadow: '0 3px 10px rgba(0,0,0,0.3)' }}
              >
                <span className="text-logoGreen">Your</span> <span className="text-white">Legal</span> <span className="text-logoGreen">Hub</span>
              </motion.h1>
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
                className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              >
                Welcome back, <span className="font-bold">{user?.name || 'User'}</span>! Manage your legal documents, edit, download, or restore them anytime.
              </motion.p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center mt-6 md:mt-8">
                <Link
                  to="/templates"
                  className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold w-full sm:w-auto text-base"
                >
                  Generate Document
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold w-full sm:w-auto text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Saved or Trashed Documents */}
        <motion.section variants={sectionVariants} className="py-8 mb-14 px-2 sm:px-0">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-primary mb-4">
              {showTrash ? 'Trashed Documents' : 'Your Documents'}
            </h2>
            {/* <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {showTrash 
                ? 'Review and restore documents you have moved to the trash, or permanently delete them.' 
                : 'Easily manage, edit, download, and organize all of your saved legal documents in one place.'}
            </p> */}
          </div>
          {/* Search and Sort Bar */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end md:gap-8 gap-4">
            <div className="flex-1">
              <label htmlFor="dashboard-search" className="block text-sm font-medium text-gray-700 mb-1.5">Search Documents</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
                <input id="dashboard-search" type="text" placeholder="e.g., NDA, Privacy, 2024-06-16..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full p-3.5 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-gray-700 shadow-sm transition-shadow hover:shadow-md"/>
              </div>
            </div>
            <div className="w-full md:w-64">
              <label htmlFor="dashboard-sort" className="block text-sm font-medium text-gray-700 mb-1.5">Sort By</label>
              <div className="relative">
                <select id="dashboard-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full p-3.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white shadow-sm appearance-none transition-shadow hover:shadow-md">
                  <option value="az">Title (A-Z)</option>
                  <option value="za">Title (Z-A)</option>
                  <option value="newest">Created (Newest)</option>
                  <option value="oldest">Created (Oldest)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none"><ArrowDownUp size={18} className="text-gray-400" /></div>
              </div>
            </div>
            <button
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border ${showTrash ? 'bg-red-100 text-red-600 border-red-200' : 'bg-white text-primary border-gray-300'} shadow-sm hover:bg-red-50 transition-colors duration-200`}
              onClick={() => setShowTrash(t => !t)}
            >
              {showTrash ? <Undo2 size={18} className="text-green-600"/> : <Trash2 size={18}/>} <span className={showTrash ? 'text-green-600 font-semibold' : ''}>{showTrash ? 'Back to Docs' : 'View Trash'}</span>
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-16 min-h-[400px]">
              <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <X size={40} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Documents</h3>
              <p className="text-gray-500 mb-4 max-w-md">{error}</p>
              <div className="text-sm text-gray-400 mb-6 space-y-1">
                <p>User ID: {user?.id || 'Not available'}</p>
                <p>API Base: {API_BASE}</p>
                <p>Attempting URL: {API_BASE}/templates?user_id={user?.id}</p>
              </div>
              <button 
                onClick={() => user?.id && fetchTemplates(user.id, true)}
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg mr-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <button 
                onClick={() => {
                  setLoading(false);
                  setError(null);
                  testWithMockData();
                }}
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Load Test Data
              </button>
            </div>
          ) : filteredAndSortedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filteredAndSortedTemplates.map(doc => {
                const parsedContent = typeof doc.content === 'string' 
                  ? (() => { try { return JSON.parse(doc.content); } catch { return { content: doc.content }; } })() 
                  : doc.content;

                const typeKey = (() => {
                  const t = doc.title.toLowerCase();
                  if (t.includes('privacy')) return 'privacyPolicy';
                  if (t.includes('nda')) return 'nda';
                  if (t.includes('refund')) return 'refundPolicy';
                  if (t.includes('power of attorney')) return 'powerOfAttorney';
                  if (t.includes('website services')) return 'websiteServicesAgreement';
                  if (t.includes('cookies')) return 'cookiesPolicy';
                  if (t.includes('eula')) return 'eula';
                  return 'generic';
                })();

                return (
                  <div key={doc.id} className="group relative">
                    {/* Visual Preview Area */}
                    <div
                      onClick={() => handleEditDocument(doc)}
                      className="aspect-[3/4] bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-accent/30 relative overflow-hidden"
                    >
                      <div className="pointer-events-none origin-top-left absolute top-0 left-0" style={{ transform: 'scale(0.42)', width: '238%', height: '238%' }}>
                        <DocumentPreview data={parsedContent} typeKey={typeKey} isThumbnail={true} />
                      </div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white text-primary px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                          <Edit3 size={16} /> Edit
                        </span>
                      </div>
                    </div>

                    {/* Info and Actions Area */}
                    <div className="flex items-start justify-between mt-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary truncate text-sm sm:text-base" title={doc.title}>{doc.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {showTrash ? 'Trashed' : 'Saved'}: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>

                      <button onClick={() => handleToggleMenu(doc.id)} className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 flex-shrink-0">
                        <MoreHorizontal size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {/* Dropdown Menu */}
                    {openMenuId === doc.id && (
                      <div ref={menuRef} className="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-100 py-1">
                        <button onClick={() => handleActionClick(() => handleViewDocument(doc))} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Eye size={16} /> View</button>
                        <button onClick={() => handleActionClick(() => handleDownloadDocument(doc, 'pdf'))} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-3-3m3 3l3-3m6-5a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7z" /></svg> Download</button>
                        <div className="my-1 h-px bg-gray-100"></div>
                        {!showTrash ? (
                          <button onClick={() => handleActionClick(() => handleDeleteDocument(doc.id))} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={16} /> Move to Trash</button>
                        ) : (
                          <button onClick={() => handleActionClick(() => handleRestoreDocument(doc.id))} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"><Undo2 size={16} /> Restore</button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={40} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {showTrash ? "No trashed documents found" : "No documents yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {showTrash 
                  ? "Your trash is empty. Deleted documents will appear here." 
                  : "Start creating your first legal document using our professional templates."
                }
              </p>
              {!showTrash && (
                <Link 
                  to="/templates" 
                  className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Document
                </Link>
              )}
            </div>
          )}
          {/* View Modal */}
          {viewModal.open && viewModal.template && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500" onClick={() => setViewModal({ open: false })}><X size={22}/></button>
                <h3 className="text-2xl font-bold text-primary mb-4">{viewModal.template.title}</h3>
                <div className="bg-gray-100 rounded p-4 text-sm overflow-x-auto max-h-96 whitespace-pre-wrap">
                  <DocumentPreview 
                    data={{
                      title: viewModal.template.title,
                      // Try to parse content as JSON, fallback to string
                      ...(typeof viewModal.template.content === 'string' ? (() => { try { return JSON.parse(viewModal.template.content); } catch { return { content: viewModal.template.content }; } })() : viewModal.template.content)
                    }}
                    typeKey={(() => {
                      const t = viewModal.template.title.toLowerCase();
                      if (t.includes('privacy')) return 'privacyPolicy';
                      if (t.includes('nda')) return 'nda';
                      if (t.includes('refund')) return 'refundPolicy';
                      if (t.includes('power of attorney')) return 'powerOfAttorney';
                      if (t.includes('website services')) return 'websiteServicesAgreement';
                      if (t.includes('cookies')) return 'cookiesPolicy';
                      if (t.includes('eula')) return 'eula';
                      return 'generic';
                    })()}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* Quick Links */}
        <motion.section variants={sectionVariants} className="py-8 mb-14 px-2 sm:px-0">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-primary mb-4">Quick Actions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get started quickly with our most popular features, from creating new documents to browsing templates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/generate" className="group block bg-white p-6 rounded-2xl shadow-lg border border-transparent hover:border-accent/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent">
                <FilePlus2 className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-primary transition-colors duration-300 group-hover:text-accent">Generate New Document</h3>
              <p className="text-base text-gray-500 mt-1">Create a new legal document from scratch.</p>
            </Link>
            <Link to="/templates" className="group block bg-white p-6 rounded-2xl shadow-lg border border-transparent hover:border-accent/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent">
                <LayoutGrid className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-primary transition-colors duration-300 group-hover:text-accent">Browse Templates</h3>
              <p className="text-base text-gray-500 mt-1">Explore our library of professional templates.</p>
            </Link>
            <Link to="/resources" className="group block bg-white p-6 rounded-2xl shadow-lg border border-transparent hover:border-accent/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent">
                <BookOpenCheck className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-primary transition-colors duration-300 group-hover:text-accent">Explore Legal Resources</h3>
              <p className="text-base text-gray-500 mt-1">Read articles and guides on legal topics.</p>
            </Link>
          </div>
        </motion.section>

        {/* Profile Settings */}
        <motion.section variants={sectionVariants} className="py-8 mb-14 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-4xl font-bold text-primary mb-8 text-center">Account Settings</h2>
          <div className="bg-lightGray p-4 sm:p-8 rounded-2xl grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 flex flex-col lg:flex-row items-start text-left gap-8">
              <div className="flex flex-col items-center lg:items-start w-full lg:w-1/2">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto lg:mx-0">
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-16 h-16 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14c3.866 0 7 1.343 7 3v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1c0-1.657 3.134-3 7-3z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14a5 5 0 100-10 5 5 0 000 10z' /></svg>
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-2 text-center lg:text-left w-full">{user?.name}
                  {user?.verified && (
                    <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-full ml-2">Verified</span>
                  )}
                </h3>
                <p className="text-textColor text-lg mb-2 text-center lg:text-left w-full">{user?.email}</p>
                {user?.created_at && (
                  <p className="text-base text-gray-400 mb-4 text-center lg:text-left w-full">Member since: {user.created_at.slice(0, 10)}</p>
                )}
                <p className="text-gray-500 text-base mb-6 text-center lg:text-left w-full">
                  Welcome to LegallyUp! Here you can view and update your personal information, track your document activity, and manage your subscription plan.
                </p>
                <div className="w-full flex flex-col gap-3 mb-6">
                  <div className="bg-lightGray rounded-lg p-4 flex flex-col items-start text-left w-full">
                    <span className="text-base text-gray-500 mb-1">Most Recent Document:</span>
                    <span className="font-semibold text-primary text-base">{mostRecentDoc ? mostRecentDoc.title : '--'}</span>
                    <span className="text-sm text-gray-400">{mostRecentDoc && mostRecentDoc.created_at ? mostRecentDoc.created_at.slice(0, 10) : ''}</span>
                  </div>
                  <div className="bg-lightGray rounded-lg p-4 flex flex-col items-start text-left w-full">
                    <span className="text-base text-gray-500 mb-1">First Document Created:</span>
                    <span className="font-semibold text-primary text-base">{firstDoc ? firstDoc.title : '--'}</span>
                    <span className="text-sm text-gray-400">{firstDoc && firstDoc.created_at ? firstDoc.created_at.slice(0, 10) : ''}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/profile/edit')}
                  className="px-6 py-2.5 bg-accent text-white rounded-lg font-semibold shadow hover:bg-accent/90 transition text-base w-full"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="hidden lg:block w-px bg-gray-200 mx-4"></div>
              
              <div className="flex-1 w-full lg:w-1/2 flex flex-col">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${user?.plan === 'Pro' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{user?.plan || 'Free'}</span>
                  <span className="text-primary font-semibold text-lg">Your Plan</span>
                </div>
                <div className="text-gray-500 text-base mb-4 text-center lg:text-left">
                  {user?.plan === 'Pro'
                    ? 'You are on the Pro plan. Enjoy unlimited access to all features and priority support.'
                    : (
                      <>
                        You are on the Free plan. Enjoy access to essential legal templates and create up to 3 documents per month.
                        <span className="block mt-4 font-semibold text-primary text-base text-center lg:text-left">Upgrade to unlock:</span>
                        <div className="bg-accent/5 rounded-lg p-4 mt-3">
                          <ul className="space-y-3">
                            <li className="flex items-center text-base font-semibold text-primary">
                              <CheckCircle className="w-5 h-5 mr-3 text-primary" /> Unlimited document creation
                            </li>
                            <li className="flex items-center text-base font-semibold text-primary">
                              <CheckCircle className="w-5 h-5 mr-3 text-primary" /> All premium templates
                            </li>
                            <li className="flex items-center text-base font-semibold text-primary">
                              <CheckCircle className="w-5 h-5 mr-3 text-primary" /> Advanced customization options
                            </li>
                            <li className="flex items-center text-base font-semibold text-primary">
                              <CheckCircle className="w-5 h-5 mr-3 text-primary" /> Priority support from legal experts
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                </div>
                <p className="text-sm text-gray-400 mb-4 text-center lg:text-left">
                  {user?.plan === 'Pro' && user?.next_billing_date ? (
                    <>Next billing date: {user.next_billing_date}</>
                  ) : (
                    <>No payment method on file</>
                  )}
                </p>
                <Link to="/pricing" className="mb-6 px-6 py-2.5 bg-accent text-white rounded-lg font-semibold shadow hover:bg-accent/90 transition text-base w-full text-center">View Pricing / Upgrade</Link>
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto lg:mx-0">
                  <div className="flex flex-col items-center bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3" aria-label='Documents Created'>
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-2xl font-extrabold text-primary mb-1 text-center">{documentsCreated}</span>
                    <span className="text-sm text-gray-500 font-medium text-center leading-tight">Documents Created</span>
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3" aria-label='Documents Trashed'>
                      <Trash2 className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-2xl font-extrabold text-primary mb-1 text-center">{documentsTrashed}</span>
                    <span className="text-sm text-gray-500 font-medium text-center leading-tight">Documents Trashed</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default DashboardPage;