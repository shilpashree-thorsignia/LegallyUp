// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the hook from the correct path
import { Trash2, Undo2, Eye, Edit3, X, Search, ArrowDownUp, Layers, CheckCircle, FileText } from 'lucide-react';
import ReactDOM from 'react-dom/client';
import DocumentPreview from '../components/DocumentPreview';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { API_BASE } from '../lib/apiBase';

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
  const [templates, setTemplates] = useState<any[]>([]);
  const [trashedTemplates, setTrashedTemplates] = useState<any[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState<{ open: boolean, template?: any }>({ open: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('az'); // 'az', 'za', 'newest', 'oldest'

  // Document stats
  const documentsCreated = templates.length + trashedTemplates.length;
  const documentsTrashed = trashedTemplates.length;
  const mostRecentDoc = templates.length > 0 ? templates[0] : null;
  const firstDoc = templates.length > 0 ? templates[templates.length - 1] : null;

  // Fetch templates helper
  const fetchTemplates = async (userId: string) => {
    setLoading(true);
    // Fetch active templates
    const resActive = await fetch(`${API_BASE}/templates?user_id=${userId}`);
    const dataActive = await resActive.json();
    setTemplates(dataActive.templates || []);
    // Fetch trashed templates
    const resTrashed = await fetch(`${API_BASE}/templates/trash?user_id=${userId}`);
    const dataTrashed = await resTrashed.json();
    setTrashedTemplates(dataTrashed.templates || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchTemplates(user.id);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewDocument = (doc: any) => {
    setViewModal({ open: true, template: doc });
  };

  const handleEditDocument = (doc: any) => {
    const editPath = getEditPath(doc.title);
    // If privacy policy, use the new route with id
    if (editPath === '/documents/generate/privacy-policy') {
      navigate(`/documents/privacy-policy/${doc.id}`, { state: { template: doc } });
    } else {
      navigate(editPath, { state: { template: doc } });
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (confirm(`Are you sure you want to move this document to trash?`)) {
      await fetch(`${API_BASE}/templates/${docId}/trash`, { method: 'POST' });
      if (user) fetchTemplates(user.id);
    }
  };

  const handleRestoreDocument = async (docId: number) => {
    await fetch(`${API_BASE}/templates/${docId}/restore`, { method: 'POST' });
    if (user) fetchTemplates(user.id);
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

      root.render(<DocumentPreview data={data} typeKey={typeKey} />);
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

  if (!user) {
    return <div className="py-8 text-center text-primary text-xl">Please sign in to view your dashboard.</div>;
  }

  return (
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
          className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-accent text-white text-center overflow-hidden relative rounded-3xl mb-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="patt" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="50" cy="50" r="1.5" fill="currentColor"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#patt)"/>
            </svg>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }} className="mb-8">
              <Layers size={72} className="mx-auto opacity-90" strokeWidth={1.2} />
            </motion.div>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tighter"
              style={{ textShadow: '0 3px 10px rgba(0,0,0,0.2)' }}
            >
              Dashboard
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-4"
            >
              Welcome back, <span className="font-bold">{user?.name || 'User'}</span>! Manage your legal documents, edit, download, or restore them anytime.
            </motion.p>
            <div className="mt-8 space-x-4">
              <Link 
                to="/generate" 
                className="bg-accent text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold"
              >
                Generate Document
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-primary px-6 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.section>

         {/* Saved or Trashed Documents */}
         <motion.section variants={sectionVariants} className="py-8 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-primary">
                {showTrash ? 'Trashed Documents' : 'Your Documents'}
              </h2>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showTrash ? 'bg-red-100 text-red-600' : 'bg-white text-primary'} shadow-sm hover:bg-red-50 transition-colors duration-200`}
                onClick={() => setShowTrash(t => !t)}
              >
                {showTrash ? <Undo2 size={18} className="text-green-600"/> : <Trash2 size={18}/>} <span className={showTrash ? 'text-green-600 font-semibold' : ''}>{showTrash ? 'Back to Documents' : 'View Trash'}</span>
              </button>
            </div>
            {/* Search and Sort Bar */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 mb-8 flex flex-col md:flex-row md:items-end md:gap-8 gap-4">
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
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </div>
            ) : filteredAndSortedTemplates.length > 0 ? (
                <div className="bg-lightGray p-6 rounded-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {filteredAndSortedTemplates.map(doc => (
                      <div key={doc.id} className="bg-white rounded-xl shadow-md border border-white p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] hover:shadow-lg">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            {/* Optional: Badge for type */}
                            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 rounded-full">
                              {(() => {
                                const t = doc.title.toLowerCase();
                                if (t.includes('nda')) return 'NDA';
                                if (t.includes('privacy')) return 'Privacy Policy';
                                if (t.includes('refund')) return 'Refund Policy';
                                if (t.includes('power of attorney')) return 'Power of Attorney';
                                if (t.includes('website services')) return 'Website Services';
                                if (t.includes('cookies')) return 'Cookies Policy';
                                if (t.includes('eula')) return 'EULA';
                                return 'Document';
                              })()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-1 truncate" title={doc.title}>{doc.title}</h3>
                          <div className="text-sm text-textColor/70 mb-2">Saved: {doc.created_at ? doc.created_at.slice(0, 10) : ''}</div>
                                 </div>
                        <div className="flex gap-2 mt-auto">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="p-2 rounded-full hover:bg-accent/10 transition group"
                            title="View"
                          >
                            <Eye size={18} className="text-accent group-hover:scale-110 transition" />
                          </button>
                          <button
                            onClick={() => handleEditDocument(doc)}
                            className="p-2 rounded-full hover:bg-accent/10 transition group"
                            title="Edit"
                          >
                            <Edit3 size={18} className="text-accent group-hover:scale-110 transition" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc, 'pdf')}
                            className="p-2 rounded-full hover:bg-primary/10 transition group"
                            title="Download PDF"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary group-hover:scale-110 transition"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l-6-6m6 6l6-6" /></svg>
                          </button>
                          {!showTrash ? (
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 rounded-full hover:bg-red-100 transition group"
                              title="Move to Trash"
                            >
                              <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestoreDocument(doc.id)}
                              className="p-2 rounded-full hover:bg-green-100 transition group"
                              title="Restore"
                            >
                              <Undo2 size={18} className="text-green-600 group-hover:scale-110 transition" />
                            </button>
                          )}
                        </div>
                      </div>
                         ))}
                  </div>
                 </div>
            ) : (
                 <div className="flex flex-col items-center justify-center py-16 text-textColor/80 text-lg bg-lightGray p-6 rounded-2xl">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" className="w-16 h-16 mb-4 text-accent"><rect width="48" height="48" rx="12" fill="#e0e7ff"/><path d="M16 20h16M16 28h8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="12" y="12" width="24" height="24" rx="4" stroke="#6366f1" strokeWidth="2"/></svg>
                     {showTrash ? "No trashed documents found." : "You haven't saved any documents yet."}
                     <Link to="/generate" className="text-accent hover:underline mt-4 inline-block font-semibold">Start Generating One!</Link>
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
          <motion.section variants={sectionVariants} className="py-8 mb-12">
             <h2 className="text-4xl font-bold text-primary mb-8 text-center md:text-left">Quick Actions</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grid for quick links */}
                 <Link to="/generate" className="block bg-white p-6 rounded-xl shadow-md border border-lightGray hover:border-accent transition-colors duration-200 text-center">
                     <div className="text-accent text-4xl mb-3">📄</div> {/* Icon */}
                     <h3 className="text-xl font-semibold text-primary">Generate New Document</h3>
                 </Link>
                  <Link to="/templates" className="block bg-white p-6 rounded-xl shadow-md border border-lightGray hover:border-accent transition-colors duration-200 text-center">
                     <div className="text-accent text-4xl mb-3">📚</div> {/* Icon */}
                     <h3 className="text-xl font-semibold text-primary">Browse Templates</h3>
                 </Link>
                  <Link to="/resources" className="block bg-white p-6 rounded-xl shadow-md border border-lightGray hover:border-accent transition-colors duration-200 text-center">
                     <div className="text-accent text-4xl mb-3">📖</div> {/* Icon */}
                     <h3 className="text-xl font-semibold text-primary">Explore Legal Resources</h3>
                 </Link>
             </div>
         </motion.section>


        {/* Profile Settings */}
       <motion.section variants={sectionVariants} className="py-8 mb-12">
            <h2 className="text-4xl font-bold text-primary mb-8 text-center md:text-left">Account Settings</h2>
            <div className="bg-lightGray p-8 rounded-2xl grid grid-cols-1 gap-8">
                {/* Combined Profile & Plan Card */}
                <div className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                    <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <svg xmlns='http://www.w3.org/2000/svg' className='w-16 h-16 text-accent' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14c3.866 0 7 1.343 7 3v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1c0-1.657 3.134-3 7-3z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14a5 5 0 100-10 5 5 0 000 10z' /></svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-accent mb-1 flex items-center gap-2">{user?.name}
                      {user?.verified && (
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full ml-2">Verified</span>
                      )}
                    </h3>
                    <p className="text-textColor text-lg mb-1">{user?.email}</p>
                    {user?.created_at && (
                      <p className="text-xs text-gray-400 mb-2">Member since: {user.created_at.slice(0, 10)}</p>
                    )}
                    <p className="text-gray-500 text-sm mb-2">
                      Welcome to LegallyUp! Here you can view and update your personal information, track your document activity, and manage your subscription plan. Take advantage of our growing library of legal templates and powerful tools to simplify your legal paperwork.
                    </p>
                    {/* Move document stats here */}
                    <div className="w-full flex flex-col gap-2 mb-4">
                      <div className="bg-lightGray rounded-lg p-3 flex flex-col items-start md:items-start text-center md:text-left">
                        <span className="text-xs text-gray-500 text-center md:text-left w-full">Most Recent Document:</span>
                        <span className="font-semibold text-primary text-sm text-center md:text-left w-full">{mostRecentDoc ? mostRecentDoc.title : '--'}</span>
                        <span className="text-xs text-gray-400 text-center md:text-left w-full">{mostRecentDoc && mostRecentDoc.created_at ? mostRecentDoc.created_at.slice(0, 10) : ''}</span>
                      </div>
                      <div className="bg-lightGray rounded-lg p-3 flex flex-col items-start md:items-start text-center md:text-left">
                        <span className="text-xs text-gray-500 text-center md:text-left w-full">First Document Created:</span>
                        <span className="font-semibold text-primary text-sm text-center md:text-left w-full">{firstDoc ? firstDoc.title : '--'}</span>
                        <span className="text-xs text-gray-400 text-center md:text-left w-full">{firstDoc && firstDoc.created_at ? firstDoc.created_at.slice(0, 10) : ''}</span>
                      </div>
                    </div>
                    <button className="mt-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold shadow hover:bg-accent/90 transition text-sm">Edit Profile (Coming Soon)</button>
                  </div>
                  {/* Divider for desktop */}
                  <div className="hidden md:block w-px bg-lightGray mx-8"></div>
                  {/* Plan and Stats */}
                  <div className="flex-1 flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${user?.plan === 'Pro' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{user?.plan || 'Free'}</span>
                      <span className="text-primary font-semibold text-lg">Your Plan</span>
                    </div>
                    <p className="text-textColor text-lg mb-1"><span className="font-semibold text-primary">Current Plan:</span> {user?.plan || 'Free'}</p>
                    <p className="text-gray-500 text-sm mb-2">
                      {user?.plan === 'Pro'
                        ? 'You are on the Pro plan. Enjoy unlimited access to all features and priority support.'
                        : (
                          <>
                            You are on the Free plan. Enjoy access to essential legal templates and create up to 3 documents per month.<br />
                            <span className="block mt-2 font-semibold text-primary">Upgrade to unlock:</span>
                            <div className="bg-accent/5 rounded-lg p-4 mt-2">
                              <ul className="space-y-3">
                                <li className="flex items-center text-base font-semibold text-primary">
                                  <CheckCircle className="w-5 h-5 mr-2 text-accent" /> Unlimited document creation
                                </li>
                                <li className="flex items-center text-base font-semibold text-primary">
                                  <CheckCircle className="w-5 h-5 mr-2 text-accent" /> All premium templates
                                </li>
                                <li className="flex items-center text-base font-semibold text-primary">
                                  <CheckCircle className="w-5 h-5 mr-2 text-accent" /> Advanced customization options
                                </li>
                                <li className="flex items-center text-base font-semibold text-primary">
                                  <CheckCircle className="w-5 h-5 mr-2 text-accent" /> Priority support from legal experts
                                </li>
                              </ul>
                            </div>
                          </>
                        )}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      {user?.plan === 'Pro' && user?.next_billing_date ? (
                        <>Next billing date: {user.next_billing_date}</>
                      ) : (
                        <>No payment method on file</>
                      )}
                    </p>
                    <Link to="/pricing" className="mt-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold shadow hover:bg-accent/90 transition text-sm inline-block">View Pricing / Upgrade</Link>
                    {/* Extra content: Documents Created and Last Login */}
                    <div className="mt-6 grid grid-cols-2 gap-6 w-full max-w-xs">
                      <div className="flex flex-col items-center bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
                        <div className="bg-blue-50 rounded-full p-1.5 mb-2 flex items-center justify-center" aria-label='Documents Created'>
                          <FileText className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-2xl font-extrabold text-primary mb-1">{documentsCreated}</span>
                        <span className="text-xs text-gray-500 font-medium text-center leading-tight">Documents Created</span>
                      </div>
                      <div className="flex flex-col items-center bg-white rounded-lg border border-red-100 p-4 shadow-sm">
                        <div className="bg-red-50 rounded-full p-1.5 mb-2 flex items-center justify-center" aria-label='Documents Trashed'>
                          <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-2xl font-extrabold text-red-600 mb-1">{documentsTrashed}</span>
                        <span className="text-xs text-gray-500 font-medium text-center leading-tight">Documents Trashed</span>
                 </div>
                 </div>
                 </div>
                 </div>
            </div>
       </motion.section>

    </motion.div>
  );
};

export default DashboardPage;