// src/pages/DashboardPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the hook from the correct path

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Placeholder data for recent documents
const mockDocuments = [
    { id: 'doc1', name: 'NDA - Project Alpha', type: 'NDA', dateSaved: '2023-10-27' },
    { id: 'doc2', name: 'Residential Lease - Elm St', type: 'Rental', dateSaved: '2023-10-25' },
    { id: 'doc3', name: 'Consultant Agreement - Blog', type: 'Consultant', dateSaved: '2023-10-20' },
    // Add more mock documents
];

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Placeholder for document actions
  const handleViewDocument = (docId: string) => {
      // TODO: Implement logic to view document (e.g., fetch from storage, show in modal)
      alert(`Placeholder: Viewing document ${docId}`);
  };

  const handleDownloadDocument = (docId: string, format: 'pdf' | 'docx') => {
      // TODO: Implement logic to download document (e.g., fetch from backend API)
      alert(`Placeholder: Downloading document ${docId} as ${format}`);
  };

   const handleEditDocument = (docId: string) => {
      // TODO: Implement logic to edit document (likely navigate back to generator with pre-filled data)
      alert(`Placeholder: Editing document ${docId}`);
       // navigate(`/generate?docId=${docId}`); // Example navigation
   };

    const handleDeleteDocument = (docId: string) => {
      // TODO: Implement logic to delete document (e.g., confirm, call backend API, update state)
      if (confirm(`Are you sure you want to delete document ${docId}?`)) {
          alert(`Placeholder: Deleting document ${docId}`);
          // Update mockDocuments state or fetch new list
      }
    };


  // Uncomment this block later to protect the route and show loading/error
  // if (loading) {
  //    return <div className="py-8 text-center text-primary text-xl">Loading dashboard...</div>;
  // }
  // if (!currentUser) {
  //    // This route should ideally be protected by react-router-dom's routing logic
  //    // However, adding a fallback message here is also good practice
  //    return (
  //         <motion.div
  //              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
  //              className="py-16 text-center text-red-600 text-2xl"
  //         >
  //              Please sign in to view your dashboard.
  //              <br/>
  //              <Link to="/signin" className="text-accent hover:underline mt-4 inline-block text-xl">Go to Sign In</Link>
  //         </motion.div>
  //     );
  // }


  return (
     <motion.div
      initial="hidden" // Apply container animation variants
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.2, // Add slight delay between sections
          },
        },
      }}
      className="py-8" // Inherits container/padding from Layout, adds vertical padding
    >

        {/* Welcome Banner */}
        <motion.section variants={sectionVariants} className="py-16 bg-primary text-textColor rounded-3xl mb-12 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome Back, {user?.name || 'User'}!
            </h1>
            <p className="text-xl text-textColor/90 max-w-2xl mx-auto mb-6">
              Your personalized legal hub awaits.
            </p>
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
             {/* Quick Nav within Banner (Optional alternative to Quick Links section) */}
             {/*
             <div className="mt-8 space-x-4">
                 <Link to="/generate" className="bg-accent text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold">Generate Document</Link>
                 <Link to="/templates" className="bg-white text-primary px-6 py-3 rounded-md hover:bg-lightGray transition-colors font-semibold">Browse Templates</Link>
             </div>
             */}
        </motion.section>

         {/* Saved Documents */}
         <motion.section variants={sectionVariants} className="py-8 mb-12">
            <h2 className="text-4xl font-bold text-primary mb-8">Your Documents</h2>
            {mockDocuments.length > 0 ? (
                <div className="bg-lightGray p-6 rounded-2xl">
                    <ul className="space-y-4">
                         {mockDocuments.map(doc => (
                             <li key={doc.id} className="bg-white p-4 rounded-lg shadow-sm border border-white flex flex-col md:flex-row justify-between items-center gap-3">
                                 <div className="text-left flex-grow">
                                     <span className="text-primary font-semibold text-lg">{doc.name}</span>
                                     <span className="text-textColor/80 text-sm ml-2 italic">({doc.type} - Saved: {doc.dateSaved})</span> {/* Optional: show type and date */}
                                 </div>
                                 <div className="flex flex-wrap gap-3 justify-center"> {/* Buttons container */}
                                      <button
                                          onClick={() => handleViewDocument(doc.id)}
                                          className="text-accent hover:underline text-sm font-semibold"
                                      >
                                          View
                                      </button>
                                      <button
                                          onClick={() => handleEditDocument(doc.id)}
                                          className="text-accent hover:underline text-sm font-semibold"
                                      >
                                          Edit
                                      </button>
                                      <button
                                          onClick={() => handleDownloadDocument(doc.id, 'pdf')}
                                          className="text-primary hover:underline text-sm font-semibold"
                                      >
                                          Download PDF
                                      </button>
                                      <button
                                          onClick={() => handleDownloadDocument(doc.id, 'docx')}
                                          className="text-primary hover:underline text-sm font-semibold"
                                      >
                                          Download DOCX
                                      </button>
                                       <button
                                          onClick={() => handleDeleteDocument(doc.id)}
                                          className="text-red-600 hover:underline text-sm font-semibold"
                                      >
                                          Delete
                                      </button>
                                 </div>
                             </li>
                         ))}
                    </ul>
                 </div>
            ) : (
                 <div className="text-center py-12 text-textColor/80 italic text-lg bg-lightGray p-6 rounded-2xl">
                     You haven't saved any documents yet.
                      <br/>
                     <Link to="/generate" className="text-accent hover:underline mt-4 inline-block font-semibold">Start Generating One!</Link>
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