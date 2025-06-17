// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the hook from the correct path
import { Trash2, Undo2, Eye, Edit3, X, Search, ArrowDownUp, Layers } from 'lucide-react';
import { generateDocx } from '../utils/docxGenerator';
import { generatePdf } from '../utils/pdfGenerator';
import { API_BASE } from '../lib/apiBase';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const getEditPath = (title = '') => {
  // Map template titles to generator routes
  if (title.toLowerCase().includes('nda')) return '/documents/nda';
  if (title.toLowerCase().includes('privacy')) return '/documents/privacy-policy';
  if (title.toLowerCase().includes('refund')) return '/documents/refund-policy';
  if (title.toLowerCase().includes('power of attorney')) return '/documents/power-of-attorney';
  if (title.toLowerCase().includes('website services')) return '/documents/website-services-agreement';
  if (title.toLowerCase().includes('cookies')) return '/documents/cookies-policy';
  if (title.toLowerCase().includes('eula')) return '/documents/eula';
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

  // Fetch templates helper
  const fetchTemplates = async (userId: string, trash = false) => {
    setLoading(true);
    const url = trash ? `${API_BASE}/templates/trash?user_id=${userId}` : `${API_BASE}/templates?user_id=${userId}`;
    const res = await fetch(url);
    const data = await res.json();
    if (trash) setTrashedTemplates(data.templates || []);
    else setTemplates(data.templates || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchTemplates(user.id, showTrash);
  }, [user, showTrash]);

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
    if (editPath === '/documents/privacy-policy') {
      navigate(`/documents/privacy-policy/${doc.id}`, { state: { template: doc } });
    } else {
      navigate(editPath, { state: { template: doc } });
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (confirm(`Are you sure you want to move this document to trash?`)) {
      await fetch(`${API_BASE}/templates/${docId}/trash`, { method: 'POST' });
      if (user) fetchTemplates(user.id, false);
    }
  };

  const handleRestoreDocument = async (docId: number) => {
    await fetch(`${API_BASE}/templates/${docId}/restore`, { method: 'POST' });
    if (user) fetchTemplates(user.id, true);
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
    if (format === 'docx') {
      await generateDocx(data, doc.title, typeKey);
    } else if (format === 'pdf') {
      // Render a hidden preview for PDF
      const previewId = `pdf-preview-${doc.id}`;
      let previewDiv = document.getElementById(previewId);
      if (!previewDiv) {
        previewDiv = document.createElement('div');
        previewDiv.id = previewId;
        previewDiv.style.position = 'absolute';
        previewDiv.style.left = '-9999px';
        previewDiv.style.top = '0';
        document.body.appendChild(previewDiv);
      }
      // Render a simple preview (customize as needed)
      previewDiv.innerHTML = `<h2>${doc.title}</h2><pre>${doc.content}</pre>`;
      await generatePdf(previewDiv, `${doc.title}.pdf`);
      document.body.removeChild(previewDiv);
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
              <div className="text-center py-12 text-textColor/80 italic text-lg bg-lightGray p-6 rounded-2xl">Loading...</div>
            ) : filteredAndSortedTemplates.length > 0 ? (
                <div className="bg-lightGray p-6 rounded-2xl">
                    <ul className="space-y-4">
                         {filteredAndSortedTemplates.map(doc => (
                             <li key={doc.id} className="bg-white p-4 rounded-lg shadow-sm border border-white flex flex-col md:flex-row justify-between items-center gap-3">
                                 <div className="text-left flex-grow">
                                     <span className="text-primary font-semibold text-lg">{doc.title}</span>
                                     <span className="text-textColor/80 text-sm ml-2 italic">(Saved: {doc.created_at ? doc.created_at.slice(0, 10) : ''})</span>
                                 </div>
                                 <div className="flex flex-wrap gap-3 justify-center">
                                      <button
                                          onClick={() => handleViewDocument(doc)}
                                          className="text-accent hover:underline text-sm font-semibold flex items-center gap-1"
                                      >
                                          <Eye size={16}/> View
                                      </button>
                                      <button
                                          onClick={() => handleEditDocument(doc)}
                                          className="text-accent hover:underline text-sm font-semibold flex items-center gap-1"
                                      >
                                          <Edit3 size={16}/> Edit
                                      </button>
                                      <button
                                          onClick={() => handleDownloadDocument(doc, 'pdf')}
                                          className="text-primary hover:underline text-sm font-semibold"
                                      >
                                          Download PDF
                                      </button>
                                      <button
                                          onClick={() => handleDownloadDocument(doc, 'docx')}
                                          className="text-primary hover:underline text-sm font-semibold"
                                      >
                                          Download DOCX
                                      </button>
                                      {!showTrash ? (
                                        <button
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="text-red-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                        >
                                            <Trash2 size={16}/> Trash
                                        </button>
                                      ) : (
                                        <button
                                            onClick={() => handleRestoreDocument(doc.id)}
                                            className="text-green-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                        >
                                            <Undo2 size={16}/> Restore
                                        </button>
                                      )}
                                 </div>
                             </li>
                         ))}
                    </ul>
                 </div>
            ) : (
                 <div className="text-center py-12 text-textColor/80 italic text-lg bg-lightGray p-6 rounded-2xl">
                     {showTrash ? "No trashed documents found." : "You haven't saved any documents yet."}
                      <br/>
                     <Link to="/generate" className="text-accent hover:underline mt-4 inline-block font-semibold">Start Generating One!</Link>
                 </div>
            )}
            {/* View Modal */}
            {viewModal.open && viewModal.template && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500" onClick={() => setViewModal({ open: false })}><X size={22}/></button>
                  <h3 className="text-2xl font-bold text-primary mb-4">{viewModal.template.title}</h3>
                  <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto max-h-96 whitespace-pre-wrap">{viewModal.template.content}</pre>
                </div>
              </div>
            )}
         </motion.section>

         {/* Quick Links */}
          <motion.section variants={sectionVariants} className="py-8 mb-12">
             <h2 className="text-4xl font-bold text-primary mb-8">Quick Actions</h2>
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
            <h2 className="text-4xl font-bold text-primary mb-8">Account Settings</h2>
            <div className="bg-lightGray p-6 rounded-2xl space-y-6 text-left"> {/* Background, padding, spacing */}
                {/* Placeholder for User Info */}
                 <div>
                     <h3 className="text-2xl font-semibold text-accent mb-4">Profile Information</h3>
                      {/* Use currentUser data here later */}
                     <p className="text-textColor text-lg"><span className="font-semibold text-primary">Email:</span> placeholder@example.com</p> {/* Dynamic email */}
                      {/* Optional: Display Name */}
                      {/* <p className="text-textColor text-lg"><span className="font-semibold text-primary">Name:</span> User Name</p> */}
                      <button className="mt-4 text-accent hover:underline font-semibold text-sm">Edit Profile (Placeholder)</button>
                 </div>

                 {/* Placeholder for Plan Info */}
                  <div>
                     <h3 className="text-2xl font-semibold text-accent mb-4">Your Plan</h3>
                     <p className="text-textColor text-lg"><span className="font-semibold text-primary">Current Plan:</span> Free</p> {/* Dynamic plan */}
                     {/* Optional: Upgrade/Manage button */}
                     <Link to="/pricing" className="mt-4 text-accent hover:underline font-semibold text-sm inline-block">View Pricing / Upgrade</Link>
                 </div>

                 {/* Placeholder for Security Settings */}
                 <div>
                     <h3 className="text-2xl font-semibold text-accent mb-4">Security</h3>
                     <button className="text-accent hover:underline font-semibold text-sm">Change Password (Placeholder)</button>
                     {/* Optional: Manage Connected Accounts (for Google/Facebook) */}
                 </div>

                {/* Optional: Logout Button within settings, or keep in Header */}
                {/*
                 <div className="mt-8 pt-6 border-t border-lightGray">
                      <button className="text-red-600 hover:underline font-semibold text-lg">Log Out (Placeholder)</button>
                 </div>
                */}

            </div>
       </motion.section>

    </motion.div>
  );
};

export default DashboardPage;