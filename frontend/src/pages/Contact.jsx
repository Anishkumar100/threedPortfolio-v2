// pages/Contact.jsx
import { useEffect } from 'react';
import ContactHero from '../sections/contact/ContactHero';
import ContactLayout from '../sections/contact/ContactLayout';
import ReachMeCards from '../sections/contact/ReachMeCards';
import FAQAccordion from "../sections/contact/FAQAccordion";
import { trackEvent } from '../services/api';

export default function Contact() {
  useEffect(() => { try { trackEvent('contact', 'pageview', {}) } catch {} }, [])

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <ContactHero />
      <ContactLayout />
      <ReachMeCards />
      <FAQAccordion />
    </main>
  );
}
