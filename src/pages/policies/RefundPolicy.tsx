import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Refund Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">1. Overview</h2>
          <p>
            At LegallyUp, we want you to be completely satisfied with our services. This refund policy outlines when and how you can request a refund for our services and subscriptions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">2. Subscription Refunds</h2>
          <p>Our subscription refund policy includes the following terms:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Monthly subscriptions can be cancelled at any time, but we do not provide partial refunds for unused periods</li>
            <li>Annual subscriptions can be refunded within 30 days of purchase for the prorated unused amount</li>
            <li>Refunds will be processed to the original payment method used for the purchase</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">3. Document Generation Services</h2>
          <p>For individual document generation services:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Refunds are available within 24 hours of purchase if the document has not been generated</li>
            <li>Once a document has been generated, we cannot offer a refund due to the immediate delivery of the service</li>
            <li>If there are technical issues preventing document generation, we will either resolve the issue or provide a full refund</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">4. Consultation Services</h2>
          <p>For attorney consultation services:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Cancellations made 24 hours or more before the scheduled consultation time will receive a full refund</li>
            <li>Cancellations made less than 24 hours before the scheduled time will be charged a 50% cancellation fee</li>
            <li>No-shows will not be eligible for a refund</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">5. How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ol className="list-decimal pl-6 mt-2">
            <li>Log into your LegallyUp account</li>
            <li>Go to the Billing section</li>
            <li>Select the service or subscription you want to refund</li>
            <li>Click on "Request Refund" and follow the prompts</li>
          </ol>
          <p className="mt-4">
            Alternatively, you can contact our support team at support@legallyup.com with your refund request.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">6. Processing Time</h2>
          <p>
            Refund requests are typically processed within 3-5 business days. Once approved, it may take an additional 5-10 business days for the refund to appear in your account, depending on your payment provider.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">7. Exceptions</h2>
          <p>
            We reserve the right to reject refund requests that do not comply with this policy or appear to be fraudulent. Special circumstances will be reviewed on a case-by-case basis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about our refund policy, please contact us at:
          </p>
          <div className="mt-2">
            <p>Email: support@legallyup.com</p>
            <p>Phone: [Your Phone Number]</p>
            <p>Address: [Your Business Address]</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default RefundPolicy; 