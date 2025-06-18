import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { blogsData, categories, type BlogPost } from '../lib/blogsData';
import HeroBackground from '../components/ui/HeroBackground';

// Lazy loaded blog card component
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/blogs/${post.id}`} className="block h-full">
        <div className="relative w-full h-48">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={post.imageUrl}
            alt={post.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {post.readTime}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <span className="ml-2 text-sm text-gray-600">{post.author}</span>
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
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white overflow-hidden rounded-b-[60px]">
        <HeroBackground />
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="mb-8 flex justify-center">
              <BookOpen size={72} className="mx-auto opacity-90 text-white" strokeWidth={1.5} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-gray-900"
            >
              Legal Insights & Updates
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