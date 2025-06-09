// src/pages/AttorneyPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Placeholder data for attorneys
const mockAttorneys = [
    { id: 'att1', name: 'Jane Doe, Esq.', photoUrl: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=JD', specialization: ['Real Estate Law', 'Contract Law'], location: 'New York, NY' },
    { id: 'att2', name: 'John Smith, Esq.', photoUrl: 'https://via.placeholder.com/150/1F3B4D/FFFFFF?text=JS', specialization: ['Intellectual Property', 'Business Law'], location: 'San Francisco, CA' },
    { id: 'att3', name: 'Emily Chen, Esq.', photoUrl: 'https://via.placeholder.com/150/F5F7FA/2C2C2C?text=EC', specialization: ['Family Law', 'Estate Planning'], location: 'Austin, TX' },
    { id: 'att4', name: 'Michael Brown, Esq.', photoUrl: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=MB', specialization: ['Employment Law', 'Labor Relations'], location: 'Chicago, IL' },
    { id: 'att5', name: 'Jessica Garcia, Esq.', photoUrl: 'https://via.placeholder.com/150/1F3B4D/FFFFFF?text=JG', specialization: ['Immigration Law'], location: 'Miami, FL' },
     { id: 'att6', name: 'David Lee, Esq.', photoUrl: 'https://via.placeholder.com/150/F5F7FA/2C2C2C?text=DL', specialization: ['Bankruptcy Law', 'Debt Relief'], location: 'Los Angeles, CA' },
    // Add more mock attorneys
];

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AttorneyPage: React.FC = () => {
  // Placeholder state for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  // Sorting isn't typically a primary need for a directory list, maybe just alphabetical by name

   // --- Placeholder Filtering Logic (Frontend Only) ---
  const filteredAttorneys = mockAttorneys
    .filter(attorney => {
      const matchesSearch = attorney.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            attorney.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            attorney.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization = selectedSpecialization === 'All' || attorney.specialization.includes(selectedSpecialization);
      const matchesLocation = selectedLocation === 'All' || attorney.location === selectedLocation;

      return matchesSearch && matchesSpecialization && matchesLocation;
    });

  // --- End Placeholder Filtering Logic ---


  // Get unique specializations and locations for filter dropdowns
  const uniqueSpecializations = [...new Set(mockAttorneys.flatMap(att => att.specialization))].sort();
  const uniqueLocations = [...new Set(mockAttorneys.map(att => att.location))].sort();


  const handleScheduleConsult = (attorneyName: string) => {
      // TODO: Implement consult scheduling logic (e.g., open modal, navigate to booking page)
      alert(`Placeholder: Initiating consult request for ${attorneyName}`);
      // This would likely require user authentication and potentially a payment flow
  }


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

        {/* NEW: Attorney Page Hero Section */}
        <motion.section variants={sectionVariants} className="text-center py-16 bg-lightGray rounded-3xl mb-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                Connect with Legal Experts
            </h1>
            <p className="text-xl text-textColor mb-0 max-w-3xl mx-auto leading-relaxed">
                Find qualified attorneys who can provide personalized legal advice and services for your specific needs.
            </p>
        </motion.section>

         {/* Search and Filter Bar */}
        <motion.section variants={sectionVariants} className="mb-12 p-6 bg-white rounded-xl shadow-sm border border-lightGray">
            <h2 className="text-2xl font-semibold text-primary mb-6">Find the Right Attorney</h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center">
                {/* Search Input */}
                <div className="flex-grow">
                    <label htmlFor="attorney-search" className="sr-only">Search attorneys</label>
                    <input
                        id="attorney-search"
                        type="text"
                        placeholder="Search by name, specialization, or location..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor"
                    />
                </div>

                 {/* Specialization Filter */}
                 <div>
                     <label htmlFor="attorney-specialization" className="sr-only">Filter by specialization</label>
                     <select
                         id="attorney-specialization"
                         value={selectedSpecialization}
                         onChange={(e) => setSelectedSpecialization(e.target.value)}
                         className="w-full md:w-auto p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor bg-white"
                     >
                         <option value="All">All Specializations</option>
                         {uniqueSpecializations.map(spec => (
                             <option key={spec} value={spec}>{spec}</option>
                         ))}
                     </select>
                 </div>

                 {/* Location Filter */}
                 <div>
                     <label htmlFor="attorney-location" className="sr-only">Filter by location</label>
                     <select
                          id="attorney-location"
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full md:w-auto p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-textColor bg-white"
                      >
                         <option value="All">All Locations</option>
                         {uniqueLocations.map(loc => (
                             <option key={loc} value={loc}>{loc}</option>
                         ))}
                     </select>
                 </div>
            </div>
        </motion.section>


        {/* Attorney List/Grid */}
       <motion.section variants={sectionVariants} className="py-8"> {/* Add padding, no background */}
            <h2 className="text-3xl font-bold text-primary mb-8">Available Attorneys ({filteredAttorneys.length})</h2> {/* Show count */}
            {filteredAttorneys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Responsive grid for attorneys */}
                    {filteredAttorneys.map(attorney => (
                        <div
                            key={attorney.id}
                            className="bg-white p-6 rounded-xl shadow-md border border-lightGray flex flex-col items-center text-center" // Center card content
                        >
                            {/* Photo Placeholder */}
                            <img
                                src={attorney.photoUrl}
                                alt={attorney.name}
                                className="w-24 h-24 rounded-full mb-4 border-2 border-accent object-cover" // Circular photo, border, object-fit
                            />
                            <h3 className="text-xl font-semibold text-primary mb-2">{attorney.name}</h3>
                            <p className="text-accent text-sm mb-3 italic">{attorney.specialization.join(', ')}</p> {/* Specializations in accent color */}
                            <p className="text-textColor text-sm mb-6">{attorney.location}</p>
                             <button
                                onClick={() => handleScheduleConsult(attorney.name)}
                                className="bg-accent text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 font-semibold w-full" // Full-width button
                            >
                                Schedule Consult
                            </button>
                        </div>
                    ))}
                </div>
             ) : (
                 <div className="text-center py-12 text-textColor/80 italic text-lg">
                    No attorneys match your criteria. Please adjust your search or filters.
                </div>
            )}
       </motion.section>


    </motion.div>
  );
};

export default AttorneyPage;