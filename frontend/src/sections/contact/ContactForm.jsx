// components/contact/ContactForm.jsx
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { submitContact, trackEvent } from '../../services/api'

// ─── Constants ─────────────────────────────────────────────────────────────────
const MESSAGE_MAX   = 500
const SUBJECTS      = [
  'Project inquiry',
  'Freelance work',
  'Full-time role',
  'Collaboration',
  'Just saying hi',
]
const INITIAL_FORM   = { name: '', email: '', subject: '', message: '' }
const INITIAL_ERRORS = { name: '', email: '', subject: '', message: '' }

// ─── Validators ────────────────────────────────────────────────────────────────
const isEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isRequired = (v) => v.trim().length > 0

// ─── Theme config ───────────────────────────────────────────────────────────────
const THEME_CFG = {
  dark: {
    accent:       '#52aeff',
    accentSoft:   'rgba(82,174,255,0.08)',
    accentBorder: 'rgba(82,174,255,0.3)',
    accentGlow:   'rgba(82,174,255,0.25)',
    accentRing:   '0 0 0 2px rgba(82,174,255,0.2)',
    ctaText:      '#000',
    inputBg:      'var(--bg-card)',
  },
  light: {
    accent:       '#d4200c',
    accentSoft:   'rgba(212,32,12,0.07)',
    accentBorder: 'rgba(212,32,12,0.25)',
    accentGlow:   'rgba(212,32,12,0.18)',
    accentRing:   '0 0 0 2px rgba(212,32,12,0.18)',
    ctaText:      '#fff',
    inputBg:      'var(--bg-card)',
  },
}

// ─── Spinner ────────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.svg
      width="16" height="16" viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
      style={{ display: 'inline-block' }}
    >
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="10" />
    </motion.svg>
  )
}

// ─── Animated success checkmark ────────────────────────────────────────────────
function SuccessCheck({ accent }) {
  return (
    <svg width="72" height="72" viewBox="0 0 52 52" style={{ color: accent }}>
      <motion.circle
        cx="26" cy="26" r="23"
        fill="none" stroke="currentColor" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
      <motion.path
        fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"
        d="M14 27 l8 8 l16 -16"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.38, ease: 'easeOut', delay: 0.55 }}
      />
    </svg>
  )
}

// ─── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, error, valid, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
        style={{ color: 'var(--text-secondary)', fontFamily: '"Mona Sans", sans-serif' }}
      >
        {label}
        {required && (
          <span style={{ color: '#ef4444', lineHeight: 1 }}>*</span>
        )}
      </label>

      <div className="relative">
        {children}

        {/* Valid check */}
        <AnimatePresence>
          {valid && (
            <motion.div
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="#22c55e" opacity="0.18" />
                <path d="M4 7l2 2 4-4" stroke="#22c55e" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="flex items-center gap-1.5 text-[0.65rem] font-medium"
            style={{ color: '#ef4444', fontFamily: '"Mona Sans", sans-serif' }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#ef4444" strokeWidth="1.4" />
              <path d="M6 3.5v3M6 8.5v.5" stroke="#ef4444" strokeWidth="1.4"
                strokeLinecap="round" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Shared input styles factory ────────────────────────────────────────────────
function useInputStyle({ accent, accentRing, error, valid, focused }) {
  let borderColor = 'var(--border-color)'
  let boxShadow   = 'none'

  if (error)   { borderColor = '#ef444450'; boxShadow = '0 0 0 2px rgba(239,68,68,0.15)' }
  if (valid)   { borderColor = '#22c55e50' }
  if (focused) { borderColor = accent; boxShadow = accentRing }

  return {
    background:  'var(--bg-card)',
    border:      `1px solid ${borderColor}`,
    borderRadius: '12px',
    color:       'var(--text-primary)',
    outline:     'none',
    transition:  'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow,
    fontFamily:  '"Mona Sans", sans-serif',
    fontSize:    '0.85rem',
    width:       '100%',
  }
}

// ─── Text input ─────────────────────────────────────────────────────────────────
function TextInput({ name, type = 'text', placeholder, value, onChange, onBlur, disabled,
                     accent, accentRing, error, valid, maxPaddingRight = false }) {
  const [focused, setFocused] = useState(false)
  const style = useInputStyle({ accent, accentRing, error: !!error, valid, focused })

  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      onBlur={(e) => { setFocused(false); onBlur(e) }}
      onFocus={() => setFocused(true)}
      style={{ ...style, padding: '0.78rem 1rem', paddingRight: maxPaddingRight ? '2.5rem' : '1rem' }}
    />
  )
}

// ─── Select ─────────────────────────────────────────────────────────────────────
function SelectInput({ name, value, onChange, onBlur, disabled, accent, accentRing, error, valid }) {
  const [focused, setFocused] = useState(false)
  const style = useInputStyle({ accent, accentRing, error: !!error, valid, focused })

  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={(e) => { setFocused(false); onBlur(e) }}
        onFocus={() => setFocused(true)}
        style={{
          ...style,
          padding: '0.78rem 2.5rem 0.78rem 1rem',
          appearance: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="">Select a subject...</option>
        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {/* Custom chevron */}
      <div
        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

// ─── Textarea ───────────────────────────────────────────────────────────────────
function TextArea({ name, value, rows, placeholder, onChange, onBlur, disabled,
                    accent, accentRing, error, valid }) {
  const [focused, setFocused] = useState(false)
  const style = useInputStyle({ accent, accentRing, error: !!error, valid, focused })

  return (
    <textarea
      name={name}
      value={value}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      onBlur={(e) => { setFocused(false); onBlur(e) }}
      onFocus={() => setFocused(true)}
      style={{
        ...style,
        padding: '0.78rem 1rem',
        resize: 'none',
        paddingRight: '2.5rem',
      }}
    />
  )
}

// ─── Character count pill ────────────────────────────────────────────────────────
function CharCount({ current, max, accent }) {
  const pct = current / max
  const color = pct > 0.9 ? '#ef4444' : pct > 0.7 ? '#f59e0b' : 'var(--text-muted)'
  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Progress arc */}
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="6" fill="none" stroke="var(--border-color)" strokeWidth="2" />
        <circle
          cx="8" cy="8" r="6" fill="none"
          stroke={pct > 0.9 ? '#ef4444' : pct > 0.7 ? '#f59e0b' : accent}
          strokeWidth="2"
          strokeDasharray={`${Math.min(pct, 1) * 37.7} 37.7`}
          strokeLinecap="round"
          transform="rotate(-90 8 8)"
          style={{ transition: 'stroke-dasharray 0.3s ease, stroke 0.3s ease' }}
        />
      </svg>
      <span
        className="text-[0.62rem] tabular-nums font-mono"
        style={{ color, transition: 'color 0.3s ease', fontFamily: 'monospace' }}
      >
        {current}/{max}
      </span>
    </div>
  )
}

// ─── Submit button ───────────────────────────────────────────────────────────────
function SubmitButton({ status, accent, accentGlow, ctaText }) {
  const isSubmitting = status === 'submitting'
  const isError      = status === 'error'

  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-[0.85rem] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 relative overflow-hidden"
      style={{
        background:  accent,
        color:       ctaText,
        boxShadow:   `0 0 28px ${accentGlow}`,
        fontFamily:  '"Mona Sans", sans-serif',
        letterSpacing: '0.04em',
      }}
      onMouseEnter={e => {
        if (!isSubmitting) {
          e.currentTarget.style.boxShadow = `0 0 48px ${accentGlow}, 0 0 0 1px ${accent}60`
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = `0 0 28px ${accentGlow}`
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <motion.span
            key="loading"
            className="flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <Spinner /> Sending...
          </motion.span>
        ) : isError ? (
          <motion.span
            key="error"
            className="flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Try again →
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            className="flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            Send message
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ─── Success state ───────────────────────────────────────────────────────────────
function SuccessState({ accent, accentSoft, accentBorder, onReset }) {
  return (
    <motion.div
      key="success"
      className="flex flex-col items-center justify-center text-center gap-5 rounded-2xl border py-16 px-8"
      style={{ background: accentSoft, borderColor: accentBorder }}
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <SuccessCheck accent={accent} />

      <div>
        <h3
          className="font-black text-[1.6rem] mb-1"
          style={{
            color: 'var(--text-primary)',
            fontFamily: '"Mona Sans", sans-serif',
            letterSpacing: '-0.025em',
          }}
        >
          Message sent!
        </h3>
        <p
          className="text-[0.85rem]"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          I'll be in touch within 24 hours.
        </p>
      </div>

      <div className="w-12 h-px" style={{ background: 'var(--border-color)' }} />

      <button
        onClick={onReset}
        className="text-[0.75rem] font-bold underline underline-offset-4 transition-opacity duration-200"
        style={{ color: accent, fontFamily: '"Mona Sans", sans-serif', opacity: 0.75 }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
      >
        Send another message
      </button>
    </motion.div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────────
export default function ContactForm() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light
  const { accent, accentSoft, accentBorder, accentGlow, accentRing, ctaText } = cfg

  const [form,    setForm]    = useState(INITIAL_FORM)
  const [errors,  setErrors]  = useState(INITIAL_ERRORS)
  const [touched, setTouched] = useState({})
  const [status,  setStatus]  = useState('idle') // idle | submitting | success | error
  const formRef = useRef(null)

  // ── Derived validity
  const validity = {
    name:    touched.name    && !errors.name    && isRequired(form.name),
    email:   touched.email   && !errors.email   && isEmail(form.email),
    message: touched.message && !errors.message && isRequired(form.message),
  }

  // ── Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    if (name === 'message' && value.length > MESSAGE_MAX) return
    setForm(p => ({ ...p, [name]: value }))
    if (touched[name]) setErrors(p => ({ ...p, [name]: '' }))
  }, [touched])

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target
    setTouched(p => ({ ...p, [name]: true }))
    let err = ''
    if (name === 'name'    && !isRequired(value)) err = 'Name is required.'
    if (name === 'email')  {
      if (!value.trim())      err = 'Email is required.'
      else if (!isEmail(value)) err = 'Enter a valid email address.'
    }
    if (name === 'message' && !isRequired(value)) err = 'Message cannot be empty.'
    setErrors(p => ({ ...p, [name]: err }))
  }, [])

  const validateAll = () => {
    const e = { ...INITIAL_ERRORS }
    let ok  = true
    if (!isRequired(form.name))  { e.name    = 'Name is required.'; ok = false }
    if (!isRequired(form.email)) { e.email   = 'Email is required.'; ok = false }
    else if (!isEmail(form.email)) { e.email = 'Enter a valid email address.'; ok = false }
    if (!isRequired(form.message)) { e.message = 'Message cannot be empty.'; ok = false }
    setErrors(e)
    setTouched({ name: true, email: true, subject: true, message: true })
    return ok
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return
    setStatus('submitting')
    try {
      const { data, error } = await submitContact({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })
      if (error) {
        setStatus('error')
      } else {
        setStatus('success')
        try { trackEvent('contact', 'contact_submit', { name: form.name }) } catch {}
      }
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setErrors(INITIAL_ERRORS)
    setTouched({})
    setStatus('idle')
  }

  // ── Shared props factory
  const inputProps = (name) => ({
    name, value: form[name],
    onChange: handleChange, onBlur: handleBlur,
    disabled: status === 'submitting',
    accent, accentRing,
    error: errors[name], valid: validity[name],
  })

  return (
    <div className="w-full" id="contact-form">
      <AnimatePresence mode="wait">

        {status === 'success' ? (
          <SuccessState
            key="success"
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
            onReset={handleReset}
          />
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Form header */}
            <div className="pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-[1.5px] rounded-full" style={{ background: accent }} />
                <span
                  className="text-[0.6rem] font-bold uppercase tracking-[0.22em]"
                  style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
                >
                  New message
                </span>
              </div>
              <h3
                className="font-black leading-tight"
                style={{
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                  color: 'var(--text-primary)',
                  fontFamily: '"Mona Sans", sans-serif',
                  letterSpacing: '-0.025em',
                }}
              >
                Send a message
              </h3>
              <p
                className="text-[0.75rem] mt-0.5"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
              >
                I read every message personally and reply within 24 hours.
              </p>
            </div>

            {/* Name + Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Name" error={errors.name} valid={validity.name} required>
                <TextInput
                  {...inputProps('name')}
                  type="text"
                  placeholder="Bruce Wayne"
                  maxPaddingRight
                />
              </Field>
              <Field label="Email" error={errors.email} valid={validity.email} required>
                <TextInput
                  {...inputProps('email')}
                  type="email"
                  placeholder="bruce@wayne.com"
                  maxPaddingRight
                />
              </Field>
            </div>

            {/* Subject */}
            <Field label="Subject" error={errors.subject} valid={!!form.subject}>
              <SelectInput {...inputProps('subject')} />
            </Field>

            {/* Message */}
            <Field label="Message" error={errors.message} valid={validity.message} required>
              {/* Char count above textarea */}
              <div className="mb-1.5">
                <CharCount current={form.message.length} max={MESSAGE_MAX} accent={accent} />
              </div>
              <TextArea
                {...inputProps('message')}
                rows={6}
                placeholder="Tell me about your project — what you're building, your timeline, and what you need help with..."
              />
            </Field>

            {/* Error banner */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border text-[0.78rem]"
                  style={{
                    background: 'rgba(239,68,68,0.07)',
                    borderColor: 'rgba(239,68,68,0.3)',
                    color: '#ef4444',
                    fontFamily: '"Mona Sans", sans-serif',
                  }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Something went wrong. Please try again.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Privacy note */}
            <p
              className="text-[0.62rem] text-center"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', opacity: 0.7 }}
            >
              No spam, ever. Your details stay between us.
            </p>

            {/* Submit */}
            <SubmitButton
              status={status}
              accent={accent}
              accentGlow={accentGlow}
              ctaText={ctaText}
            />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}