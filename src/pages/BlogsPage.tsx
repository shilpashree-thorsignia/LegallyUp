import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

const sampleBlogs: BlogPost[] = [
  {
    id: 1,
    title: "Understanding Legal Document Automation",
    excerpt: "Explore how AI and automation are transforming the legal document creation process...",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Legal Tech",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Essential Legal Documents for Startups",
    excerpt: "A comprehensive guide to the legal documents every startup needs to succeed...",
    author: "Michael Chen",
    date: "March 12, 2024",
    category: "Startup Law",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "The Future of Legal Services",
    excerpt: "How technology is reshaping the legal industry and improving access to justice...",
    author: "Emily Rodriguez",
    date: "March 10, 2024",
    category: "Industry Trends",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Privacy Policies in 2024",
    excerpt: "Latest requirements and best practices for creating compliant privacy policies...",
    author: "David Thompson",
    date: "March 8, 2024",
    category: "Privacy Law",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Smart Contracts Explained",
    excerpt: "A beginner's guide to understanding and implementing smart contracts...",
    author: "Alex Kumar",
    date: "March 5, 2024",
    category: "Blockchain",
    imageUrl: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3",
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "Legal Document Management Tips",
    excerpt: "Best practices for organizing and managing your legal documents effectively...",
    author: "Rachel White",
    date: "March 3, 2024",
    category: "Document Management",
    imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3",
    readTime: "5 min read"
  }
];

const BlogsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Insights & Updates</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay informed with the latest legal trends, insights, and practical guides from our expert contributors.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {['All', 'Legal Tech', 'Startup Law', 'Privacy Law', 'Industry Trends', 'Document Management'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleBlogs.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <Link to={`/blogs/${post.id}`}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
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
          </article>
        ))}
      </div>

      {/* Newsletter Subscription */}
      <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-gray-600 mb-6">
          Get the latest legal insights and updates delivered straight to your inbox.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage; 