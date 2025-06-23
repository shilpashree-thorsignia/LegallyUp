// src/pages/AttorneyPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, ChevronRight, Shield, } from 'lucide-react';
import HeroBackground from '../components/ui/HeroBackground';

// Updated placeholder data for attorneys with more details
const mockAttorneys = [
    { id: 'att1', name: 'Jane Doe, Esq.', slug: 'jane-doe-esq', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Real Estate Law', 'Contract Law'], location: 'New York, NY', experience: '10+ Years', bio: 'Specializing in complex real estate transactions and contract negotiations for businesses and individuals.' },
    { id: 'att2', name: 'John Smith, Esq.', slug: 'john-smith-esq', photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Intellectual Property', 'Business Law'], location: 'San Francisco, CA', experience: '8 Years', bio: 'Helping startups and established companies protect their IP and navigate corporate legalities.' },
    { id: 'att3', name: 'Emily Chen, Esq.', slug: 'emily-chen-esq', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Family Law', 'Estate Planning'], location: 'Austin, TX', experience: '12 Years', bio: 'Compassionate and experienced attorney dedicated to family law matters and estate planning services.' },
    { id: 'att4', name: 'Michael Brown, Esq.', slug: 'michael-brown-esq', photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Employment Law', 'Labor Relations'], location: 'Chicago, IL', experience: '15 Years', bio: 'Expert in employment disputes, workplace investigations, and labor law compliance for employers and employees.'},
    { id: 'att5', name: 'Jessica Garcia, Esq.', slug: 'jessica-garcia-esq', photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Immigration Law'], location: 'Miami, FL', experience: '7 Years', bio: 'Assisting individuals and families with visas, green cards, citizenship, and deportation defense.' },
    { id: 'att6', name: 'David Lee, Esq.', slug: 'david-lee-esq', photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=150&h=150&q=80', specialization: ['Bankruptcy Law', 'Debt Relief'], location: 'Los Angeles, CA', experience: '9 Years', bio: 'Providing guidance and representation for individuals and businesses facing financial distress.' },
];

const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 50 } } };
const cardVariants = { hidden: { opacity: 0, y: 30, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }};

const AttorneyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleScheduleConsult = (attorneyId: string, attorneyName: string, attorneySlug: string) => {
    navigate(`/schedule-consultation/${attorneySlug}`, {
      state: { attorneyId, attorneyName }
    });
  };

  return (
     <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
      className="bg-gray-50 min-h-screen"
    >
        <motion.section
            variants={sectionVariants}
            className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white overflow-hidden"
        >
            <HeroBackground />
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            <div className="w-full relative z-10 text-center">
                <Shield size={64} className="mx-auto mb-6 opacity-90 text-logoGreen" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-white"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    <span className="text-logoGreen">Connect</span> with Legal Experts
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-0 max-w-3xl mx-auto leading-relaxed">
                    Find qualified attorneys ready to provide personalized legal advice and services tailored to your unique needs.
                </p>
            </div>
        </motion.section>

        {/* <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-6">
                    <Filter size={28} className="text-primary mr-3" />
                    <h2 className="text-2xl font-semibold text-primary">Find the Right Attorney</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label htmlFor="attorney-search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
                            <input id="attorney-search" type="text" placeholder="Name, specialization, location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 shadow-sm"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="attorney-specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <select id="attorney-specialization" value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white shadow-sm appearance-none">
                            {uniqueSpecializations.map(spec => (<option key={spec} value={spec}>{spec}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="attorney-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select id="attorney-location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white shadow-sm appearance-none">
                            {uniqueLocations.map(loc => (<option key={loc} value={loc}>{loc}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        </motion.section> */}

       <motion.section variants={sectionVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-primary mb-10">
                Meet Our Network of Attorneys 
            </h2>
            {mockAttorneys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockAttorneys.map(attorney => (
                        <motion.div
                            key={attorney.id}
                            variants={cardVariants}
                            className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 flex flex-col group transform hover:-translate-y-2 overflow-hidden"
                        >
                            <div className="p-6 text-center">
                                <img
                                    src={attorney.photoUrl}
                                    alt={attorney.name}
                                    className="w-32 h-32 rounded-full mb-5 mx-auto border-4 border-accent group-hover:border-primary transition-colors object-cover shadow-md"
                                />
                                <h3 className="text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors">{attorney.name}</h3>
                                <p className="text-sm text-gray-500 mb-1">{attorney.experience} Experience</p>
                                <p className="text-accent text-sm font-medium mb-3 flex items-center justify-center gap-1"><MapPin size={14}/> {attorney.location}</p>
                            </div>
                            <div className="px-6 pb-4">
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Specializations:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {attorney.specialization.map(spec => (
                                            <span key={spec} className="text-xs bg-lightGray text-textColor px-2.5 py-1 rounded-full">{spec}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[60px] text-center px-2">{attorney.bio.length > 100 ? `${attorney.bio.substring(0, 97)}...` : attorney.bio}</p>
                            </div>
                             <div className="mt-auto bg-gray-50 p-5 border-t border-gray-200">
                                <button
                                    onClick={() => handleScheduleConsult(attorney.id, attorney.name, attorney.slug)}
                                    className="w-full bg-primary text-white px-6 py-3 rounded-lg text-md font-semibold hover:bg-accent transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2"
                                >
                                    Schedule Consultation <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
             ) : (
                 <motion.div variants={cardVariants} className="text-center py-20 px-6 text-gray-500 italic text-lg bg-white rounded-xl shadow-md border">
                    <Users size={64} className="mx-auto mb-6 text-gray-400" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">No attorneys match your current filters.</p>
                    <p>Try broadening your search or selecting different specializations or locations.</p>
                </motion.div>
            )}
       </motion.section>
    </motion.div>
  );
};

export default AttorneyPage;