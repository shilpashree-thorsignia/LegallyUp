import React from 'react';
import { useParams } from 'react-router-dom';

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams();

  // This would typically come from an API call using the blogId
  const blog = {
    title: "Understanding Legal Document Automation",
    content: `
      <p class="mb-4">Legal document automation is revolutionizing the way legal professionals and businesses handle their documentation needs. This transformation is not just about digitization; it's about creating intelligent systems that can understand, process, and generate legal documents with minimal human intervention.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">The Evolution of Legal Documentation</h2>
      <p class="mb-4">Traditional legal document creation has been a time-consuming and error-prone process. Lawyers and legal professionals spent countless hours drafting, reviewing, and editing documents. With the advent of legal document automation, this process has been streamlined significantly.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Key Benefits of Document Automation</h2>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Increased efficiency and productivity</li>
        <li class="mb-2">Reduced human error</li>
        <li class="mb-2">Consistent document formatting</li>
        <li class="mb-2">Cost-effective solution</li>
        <li class="mb-2">Better compliance management</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Implementation Strategies</h2>
      <p class="mb-4">Implementing document automation requires careful planning and consideration of various factors:</p>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Assess your current document workflow</li>
        <li class="mb-2">Identify automation opportunities</li>
        <li class="mb-2">Choose the right automation tools</li>
        <li class="mb-2">Train your team</li>
        <li class="mb-2">Monitor and optimize the process</li>
      </ol>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Future Trends</h2>
      <p class="mb-4">The future of legal document automation looks promising with emerging technologies like artificial intelligence and machine learning playing a crucial role in making these systems more intelligent and capable.</p>
    `,
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Legal Tech",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    readTime: "5 min read"
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Article Header */}
      <div className="mb-8">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-[400px] object-cover rounded-xl mb-8"
        />
        <div className="flex items-center gap-4 mb-4">
          <span className="text-blue-600 font-medium">{blog.category}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{blog.readTime}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
            <div>
              <p className="font-medium text-gray-900">{blog.author}</p>
              <p className="text-gray-500">{blog.date}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Related Articles */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-${i === 1 ? '1507679799987-c73779587ccf' : '1450101499163-c8848c66ca85'}?ixlib=rb-4.0.3`}
                alt="Related article"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {i === 1 ? 'Essential Legal Documents for Startups' : 'The Future of Legal Services'}
                </h3>
                <p className="text-gray-600">
                  {i === 1 
                    ? 'A comprehensive guide to the legal documents every startup needs...' 
                    : 'How technology is reshaping the legal industry and improving...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 