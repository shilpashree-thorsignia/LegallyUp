import React from 'react';
import { motion } from 'framer-motion';

const TermsAndConditions: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl py-12 px-4 sm:px-6 lg:px-8 text-left"
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Terms and Conditions</h1>
      <div className="prose prose-lg max-w-none text-left">
        <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using LegallyUp's website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">2. Description of Services</h2>
          <p>
            LegallyUp provides an online platform for legal document generation, template access, and legal resources. Our services include:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Document generation tools</li>
            <li>Legal document templates</li>
            <li>Legal resources and guides</li>
            <li>Attorney directory and consultation services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account credentials and for any activities under your account.
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>You must be 18 years or older to create an account</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must notify us immediately of any unauthorized access</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">4. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by LegallyUp and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">5. User Content</h2>
          <p>
            By submitting content to our platform, you grant us the right to use, modify, perform, display, reproduce, and distribute such content on our services. You represent and warrant that you own or control all rights in such content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">6. Disclaimer</h2>
          <p>
            Our services are provided "as is" without any warranty of any kind. We do not provide legal advice, and the generated documents should be reviewed by a qualified legal professional before use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">7. Limitation of Liability</h2>
          <p>
            In no event shall LegallyUp be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these terms at any time. We will provide notice of any significant changes. Your continued use of our service after such modifications constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <div className="mt-2">
            <p>Email: support@legallyup.com</p>
            <p>Address: [Your Business Address]</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions; 