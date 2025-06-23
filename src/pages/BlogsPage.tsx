import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { blogsData, categories, type BlogPost } from '../lib/blogsData';


// Lazy loaded blog card component
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <Link to={`/blogs/${post.id}`} className="block h-full">
        <div className="relative w-full h-52 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <BookOpen 
            size={64} 
            className="relative z-10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
          />
        </div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {post.readTime}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-6 line-clamp-2 text-base">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-primary font-medium text-sm">
                  {post.author.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{post.author}</span>
            </div>
            <span className="text-sm text-gray-500">{post.date}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const BlogsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const filteredBlogs = selectedCategory === 'All'
    ? blogsData
    : blogsData.filter(blog => blog.category === selectedCategory);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center bg-logoBlue text-white overflow-hidden">
        <div className="w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="mb-8 flex justify-center">
                              <BookOpen size={72} className="mx-auto opacity-90 text-logoGreen" strokeWidth={1.5} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                          >
                <span className="text-logoGreen">Legal</span> Insights & Updates
              </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Stay informed with the latest legal trends, tips, and expert advice to help you navigate the legal landscape.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {isLoading ? (
              // Loading skeletons
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              filteredBlogs.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogsPage; 