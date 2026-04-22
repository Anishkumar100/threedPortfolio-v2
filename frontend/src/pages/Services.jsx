import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchServices, fetchCategories, submitInquiry, trackEvent } from '../services/api';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
});

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg =
    type === 'success'
      ? 'rgba(34,197,94,0.12)'
      : 'rgba(239,68,68,0.12)';
  const border =
    type === 'success'
      ? 'rgba(34,197,94,0.3)'
      : 'rgba(239,68,68,0.3)';
  const color = type === 'success' ? '#22c55e' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 10000,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '12px',
        padding: '14px 20px',
        maxWidth: '380px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: '"Mona Sans", sans-serif',
        fontSize: '0.82rem',
        fontWeight: 600,
        color,
        backdropFilter: 'blur(16px)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {type === 'success' ? (
          <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></>
        ) : (
          <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
        )}
      </svg>
      {message}
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ width: '70%', height: '18px', borderRadius: '6px', background: 'var(--bg-card-hover)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ width: '100%', height: '12px', borderRadius: '4px', background: 'var(--bg-card-hover)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.15s' }} />
      <div style={{ width: '85%', height: '12px', borderRadius: '4px', background: 'var(--bg-card-hover)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.3s' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ width: '60px', height: '24px', borderRadius: '6px', background: 'var(--bg-card-hover)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Inquiry Modal ────────────────────────────────────────────────────────────
function InquiryModal({ service, onClose, onSuccess, accent, isDark }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', budget: '', timeline: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await trackEvent('services', 'inquiry_start', { serviceId: service?._id, serviceName: service?.title });
    } catch { /* fire and forget */ }

    const { error } = await submitInquiry({
      ...form,
      serviceId: service?._id || '',
      serviceName: service?.title || '',
    });

    setSubmitting(false);

    if (error) {
      onSuccess(false);
    } else {
      onSuccess(true);
      onClose();
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    fontFamily: '"Mona Sans", sans-serif',
    fontSize: '0.84rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontFamily: '"Mona Sans", sans-serif',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: '20px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          padding: '28px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, fontFamily: '"Mona Sans", sans-serif', marginBottom: '6px' }}>
              Service Inquiry
            </p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.025em', margin: 0 }}>
              {service?.title || 'Request Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : 'var(--border-color)' }} />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '0.65rem', marginTop: '4px', fontFamily: '"Mona Sans", sans-serif' }}>{errors.name}</p>}
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : 'var(--border-color)' }} />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '0.65rem', marginTop: '4px', fontFamily: '"Mona Sans", sans-serif' }}>{errors.email}</p>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Phone (optional)</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Budget</label>
              <select name="budget" value={form.budget} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select budget...</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                <option value="$50,000+">$50,000+</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Timeline</label>
              <select name="timeline" value={form.timeline} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select timeline...</option>
                <option value="ASAP">ASAP</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2-3 months">2-3 months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              rows={4}
              style={{ ...inputStyle, resize: 'none', borderColor: errors.message ? '#ef4444' : 'var(--border-color)' }}
            />
            {errors.message && <p style={{ color: '#ef4444', fontSize: '0.65rem', marginTop: '4px', fontFamily: '"Mona Sans", sans-serif' }}>{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: accent,
              color: isDark ? '#000' : '#fff',
              fontFamily: '"Mona Sans", sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, index, accent, isDark, onRequestService }) {
  const cardRef = useRef(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          try { trackEvent('services', 'service_view', { serviceId: service._id, serviceName: service.title }); } catch { /* */ }
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, [service._id, service.title]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      style={{
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}40`;
        e.currentTarget.style.boxShadow = `0 8px 32px ${accent}12`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Featured badge */}
      {service.isFeatured && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            fontSize: '0.55rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: accent,
            background: `${accent}14`,
            border: `1px solid ${accent}30`,
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: '"Mona Sans", sans-serif',
          }}
        >
          ★ Featured
        </div>
      )}

      {/* Title + category */}
      <div>
        <span
          style={{
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontFamily: '"Mona Sans", sans-serif',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          {service.category}
        </span>
        <h3
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: '"Mona Sans", sans-serif',
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.2,
            paddingRight: service.isFeatured ? '80px' : '0',
          }}
        >
          {service.title}
        </h3>
      </div>

      {/* Short description */}
      <p
        style={{
          fontSize: '0.82rem',
          lineHeight: 1.75,
          color: 'var(--text-muted)',
          fontFamily: '"Mona Sans", sans-serif',
          margin: 0,
        }}
      >
        {service.shortDescription}
      </p>

      {/* Tech stack chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {service.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Deliverables */}
      {service.deliverables.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {service.deliverables.slice(0, 3).map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  fontFamily: '"Mona Sans", sans-serif',
                }}
              >
                {d}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Rate + timeline + CTA */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span
            style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
              fontWeight: 900,
              color: accent,
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            ${service.hourlyRate}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              fontFamily: '"Mona Sans", sans-serif',
              marginLeft: '4px',
            }}
          >
            /hr
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              fontFamily: '"Mona Sans", sans-serif',
              opacity: 0.6,
              marginTop: '2px',
            }}
          >
            {service.estimatedTimeline}
          </span>
        </div>

        <button
          onClick={() => onRequestService(service)}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: accent,
            color: isDark ? '#000' : '#fff',
            fontFamily: '"Mona Sans", sans-serif',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${accent}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Request Service
        </button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalService, setModalService] = useState(null);
  const [toast, setToast] = useState(null);

  // Analytics on mount
  useEffect(() => {
    try { trackEvent('services', 'pageview', {}); } catch { /* */ }
  }, []);

  // Fetch services + categories
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const [svcRes, catRes] = await Promise.all([
        fetchServices(),
        fetchCategories(),
      ]);

      if (svcRes.error) {
        setError(svcRes.error);
        setLoading(false);
        return;
      }

      setServices(svcRes.data?.data || []);
      setCategories(catRes.data?.data || []);
      setLoading(false);
    };

    load();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category === activeCategory);

  const handleInquiryResult = useCallback((success) => {
    setToast({
      type: success ? 'success' : 'error',
      message: success
        ? 'Inquiry submitted! I\'ll get back to you soon.'
        : 'Something went wrong. Please try again.',
    });
  }, []);

  // Stat pills
  const minRate = services.length > 0 ? Math.min(...services.map((s) => s.hourlyRate)) : 0;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: '62px', borderBottom: '1px solid var(--border-color)' }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--border-color) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-color) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 55% 55% at 50% 55%, ${accent}09, transparent 68%)` }}
        />

        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 pb-14">
          <motion.div {...fadeUp(0)} className="mb-5">
            <span
              className="text-[0.6rem] tracking-[0.22em] uppercase font-bold px-3 py-1.5 rounded-full"
              style={{
                background: `${accent}10`,
                border: `1px solid ${accent}30`,
                color: accent,
                fontFamily: '"Mona Sans", sans-serif',
              }}
            >
              Services
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.07)}
            className="font-black leading-[1.05] mb-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              color: 'var(--text-primary)',
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '-0.03em',
            }}
          >
            What I <span style={{ color: accent }}>Build</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.12)}
            className="text-[0.88rem] leading-[1.85] mb-8 max-w-[520px]"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            From full-stack applications to immersive 3D experiences —
            production-grade development with transparent pricing and clear deliverables.
          </motion.p>

          {/* Stat pills */}
          <motion.div {...fadeUp(0.17)} className="flex flex-wrap gap-3">
            {[
              { value: services.length || '—', label: 'Services' },
              { value: minRate ? `$${minRate}/hr` : '—', label: 'Starting Rate' },
              { value: 'Open', label: 'Availability' },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: accent,
                    fontFamily: '"Mona Sans", sans-serif',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontFamily: '"Mona Sans", sans-serif',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-16">

        {/* Category filter */}
        {categories.length > 0 && (
          <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-2 mb-10">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: `1px solid ${activeCategory === cat ? accent : 'var(--border-color)'}`,
                  background: activeCategory === cat ? `${accent}14` : 'transparent',
                  color: activeCategory === cat ? accent : 'var(--text-muted)',
                  fontFamily: '"Mona Sans", sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <motion.div
            {...fadeUp(0)}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.4 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', fontSize: '0.88rem' }}>
              Unable to load services. Please try again later.
            </p>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <motion.div
            {...fadeUp(0)}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', fontSize: '0.88rem' }}>
              No services found in this category.
            </p>
          </motion.div>
        )}

        {/* Services grid */}
        {!loading && !error && filtered.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {filtered.map((service, i) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={i}
                accent={accent}
                isDark={isDark}
                onRequestService={setModalService}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 3rem)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${accent}30, transparent)`,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          style={{ maxWidth: '520px', margin: '0 auto' }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '-0.03em',
              marginBottom: '12px',
            }}
          >
            Have a different project in mind?
          </h2>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              fontFamily: '"Mona Sans", sans-serif',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}
          >
            Let's talk about your idea — every great product starts with a conversation.
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '12px',
              background: accent,
              color: isDark ? '#000' : '#fff',
              fontFamily: '"Mona Sans", sans-serif',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 28px ${accent}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Get in Touch
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* ── MODAL ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalService && (
          <InquiryModal
            service={modalService}
            onClose={() => setModalService(null)}
            onSuccess={handleInquiryResult}
            accent={accent}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* ── TOAST ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <Toast
            key="toast"
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Skeleton pulse animation */}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
    </main>
  );
}
