import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, Bookmark, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlogById, getRelatedBlogs, type BlogPost } from '../lib/blogsData';
import { motion } from 'framer-motion';

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!blogId) {
      navigate('/blogs');
      return;
    }

    const blogData = getBlogById(Number(blogId));
    if (!blogData) {
      navigate('/blogs');
      return;
    }

    setBlog(blogData);
    setRelatedBlogs(getRelatedBlogs(Number(blogId), blogData.category));
  }, [blogId, navigate]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // You can implement actual bookmark functionality here
  };

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="w-full h-[400px] bg-gray-200 rounded-xl mb-8" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Back to Blogs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Blogs
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] bg-gray-900">
        <div className="absolute inset-0">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover opacity-40"
            width="1200"
            height="600"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {blog.category}
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                {blog.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Meta */}
        <div className="bg-white rounded-xl shadow-sm p-6 -mt-32 relative z-10 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                {blog.author[0]}
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">{blog.author}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{blog.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              <button
                onClick={handleBookmark}
                className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-5 h-5 mr-2" />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Related Articles */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <Link
                key={relatedBlog.id}
                to={`/blogs/${relatedBlog.id}`}
                className="group"
              >
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={relatedBlog.imageUrl}
                    alt={relatedBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {relatedBlog.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {relatedBlog.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{relatedBlog.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{relatedBlog.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              View All Articles
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetailPage; 