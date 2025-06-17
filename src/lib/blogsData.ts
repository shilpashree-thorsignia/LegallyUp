export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

export const blogsData: BlogPost[] = [
  {
    id: 1,
    title: "Understanding Legal Document Automation",
    excerpt: "Explore how AI and automation are transforming the legal document creation process...",
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
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Essential Legal Documents for Startups",
    excerpt: "A comprehensive guide to the legal documents every startup needs to succeed...",
    content: `
      <p class="mb-4">Starting a new business involves numerous legal considerations and documentation requirements. This comprehensive guide outlines the essential legal documents that every startup needs to establish a strong foundation and protect their interests.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Foundational Documents</h2>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Articles of Incorporation/Organization</li>
        <li class="mb-2">Operating Agreement/Bylaws</li>
        <li class="mb-2">Shareholder Agreements</li>
        <li class="mb-2">Founder Agreements</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Employment and HR Documents</h2>
      <p class="mb-4">Proper employment documentation is crucial for protecting both the company and its employees:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Employment Contracts</li>
        <li class="mb-2">Non-Disclosure Agreements (NDAs)</li>
        <li class="mb-2">Employee Handbook</li>
        <li class="mb-2">Workplace Policies</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Intellectual Property Protection</h2>
      <p class="mb-4">Protecting your intellectual property is vital for startups:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Patent Applications</li>
        <li class="mb-2">Trademark Registrations</li>
        <li class="mb-2">Copyright Notices</li>
        <li class="mb-2">IP Assignment Agreements</li>
      </ul>
    `,
    author: "Michael Chen",
    date: "March 12, 2024",
    category: "Startup Law",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "The Future of Legal Services",
    excerpt: "How technology is reshaping the legal industry and improving access to justice...",
    content: `
      <p class="mb-4">The legal industry is undergoing a significant transformation driven by technological advancements. From AI-powered legal research to blockchain-based smart contracts, these innovations are reshaping how legal services are delivered and consumed.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Key Technological Trends</h2>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Artificial Intelligence in Legal Research</li>
        <li class="mb-2">Blockchain and Smart Contracts</li>
        <li class="mb-2">Cloud-Based Practice Management</li>
        <li class="mb-2">Virtual Law Offices</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Improving Access to Justice</h2>
      <p class="mb-4">Technology is making legal services more accessible to everyone:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Online Legal Platforms</li>
        <li class="mb-2">DIY Legal Tools</li>
        <li class="mb-2">Virtual Legal Consultations</li>
        <li class="mb-2">Automated Document Services</li>
      </ul>
    `,
    author: "Emily Rodriguez",
    date: "March 10, 2024",
    category: "Industry Trends",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Privacy Policies in 2024",
    excerpt: "Latest requirements and best practices for creating compliant privacy policies...",
    content: `
      <p class="mb-4">Privacy policies have become increasingly important in today's digital age. With new regulations and growing privacy concerns, businesses must ensure their privacy policies are comprehensive and compliant.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Essential Components</h2>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Data Collection Practices</li>
        <li class="mb-2">Use of Personal Information</li>
        <li class="mb-2">Data Security Measures</li>
        <li class="mb-2">User Rights and Choices</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Compliance Requirements</h2>
      <p class="mb-4">Key regulations to consider:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">GDPR Requirements</li>
        <li class="mb-2">CCPA Compliance</li>
        <li class="mb-2">Industry-Specific Regulations</li>
        <li class="mb-2">International Data Protection Laws</li>
      </ul>
    `,
    author: "David Thompson",
    date: "March 8, 2024",
    category: "Privacy Law",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Smart Contracts Explained",
    excerpt: "A beginner's guide to understanding and implementing smart contracts...",
    content: `
      <p class="mb-4">Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They run on blockchain technology and automatically enforce contractual terms without intermediaries.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Automated Execution</li>
        <li class="mb-2">Transparency</li>
        <li class="mb-2">Immutability</li>
        <li class="mb-2">Cost Efficiency</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Implementation Guide</h2>
      <p class="mb-4">Steps to implement smart contracts:</p>
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">Choose the Right Platform</li>
        <li class="mb-2">Define Contract Terms</li>
        <li class="mb-2">Write and Test Code</li>
        <li class="mb-2">Deploy and Monitor</li>
      </ol>
    `,
    author: "Alex Kumar",
    date: "March 5, 2024",
    category: "Blockchain",
    imageUrl: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "Legal Document Management Tips",
    excerpt: "Best practices for organizing and managing your legal documents effectively...",
    content: `
      <p class="mb-4">Effective document management is crucial for legal professionals and organizations. Learn the best practices for organizing, storing, and retrieving legal documents efficiently.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Organization Strategies</h2>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Consistent Naming Conventions</li>
        <li class="mb-2">Folder Structure Best Practices</li>
        <li class="mb-2">Version Control Systems</li>
        <li class="mb-2">Document Classification</li>
      </ul>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Digital Tools</h2>
      <p class="mb-4">Essential tools for document management:</p>
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">Document Management Systems</li>
        <li class="mb-2">Cloud Storage Solutions</li>
        <li class="mb-2">Collaboration Platforms</li>
        <li class="mb-2">Security Tools</li>
      </ul>
    `,
    author: "Rachel White",
    date: "March 3, 2024",
    category: "Document Management",
    imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    readTime: "5 min read"
  }
];

export const categories = ['All', 'Legal Tech', 'Startup Law', 'Privacy Law', 'Industry Trends', 'Document Management', 'Blockchain'];

export const getBlogById = (id: number): BlogPost | undefined => {
  return blogsData.find(blog => blog.id === id);
};

export const getRelatedBlogs = (currentBlogId: number, category: string): BlogPost[] => {
  return blogsData
    .filter(blog => blog.id !== currentBlogId && blog.category === category)
    .slice(0, 2);
}; 