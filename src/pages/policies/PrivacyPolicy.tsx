import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl py-12 px-4 sm:px-6 lg:px-8 text-left"
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-left">
        <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">1. Introduction</h2>
          <p>
            Welcome to LegallyUp. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">2. Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Identity Data (name, username)</li>
            <li>Contact Data (email address, phone number)</li>
            <li>Technical Data (IP address, browser type, device information)</li>
            <li>Usage Data (how you use our website and services)</li>
            <li>Marketing Data (your preferences in receiving marketing from us)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">3. How We Use Your Data</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>To provide and maintain our services</li>
            <li>To notify you about changes to our services</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our services</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">4. Data Security</h2>
          <p>
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">5. Your Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <div className="mt-2">
            <p>Email: privacy@legallyup.com</p>
            <p>Address: [Your Business Address]</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy; 