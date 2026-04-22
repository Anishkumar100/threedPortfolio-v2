// sections/contact/ContactLayout.jsx
import { motion } from 'framer-motion';
import ContactInfo from "./ContactInfo";
import ContactForm from './ContactForm';

export default function ContactLayout() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Left — Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ContactInfo />
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        >
          <ContactForm />
        </motion.div>

      </div>
    </section>
  );
}
