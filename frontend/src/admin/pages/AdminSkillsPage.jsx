import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { adminSkills } from '../../services/api';

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const isOk = type === 'success';
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000,
      background: isOk ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      border: `1px solid ${isOk ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
      borderRadius: '12px', padding: '14px 20px', fontSize: '0.8rem', fontWeight: 600,
      color: isOk ? '#22c55e' : '#ef4444', fontFamily: '"Mona Sans", sans-serif',
      backdropFilter: 'blur(16px)', animation: 'adm-fadeIn 0.3s ease',
    }}>
      {msg}
    </div>
  );
}

function NestedSkillEditor({ skills, onChange, accent, isDark }) {
  const items = skills || [];

  const update = (idx, field, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: field === 'level' || field === 'since' ? Number(value) || 0 : value };
    onChange(updated);
  };

  const add = () => {
    onChange([...items, { name: '', level: 3, since: new Date().getFullYear(), desc: '' }]);
  };

  const remove = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...items];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    onChange(updated);
  };

  const moveDown = (idx) => {
    if (idx >= items.length - 1) return;
    const updated = [...items];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    onChange(updated);
  };

  const inputStyle = {
    width: '100%', padding: '8px 10px', borderRadius: '6px',
    border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
    fontSize: '0.76rem', outline: 'none',
  };

  const labelStyle = {
    fontSize: '0.46rem', fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--text-muted)',
    fontFamily: '"Mona Sans", sans-serif', display: 'block', marginBottom: '3px',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
            Individual Skills
          </span>
          <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', background: `${accent}10`, color: accent, fontWeight: 700 }}>
            {items.length}
          </span>
        </div>
        <button onClick={add} style={{
          padding: '6px 14px', borderRadius: '6px', border: `1px dashed ${accent}40`,
          background: 'transparent', color: accent, fontFamily: '"Mona Sans", sans-serif',
          fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add Skill
        </button>
      </div>

      {items.length === 0 && (
        <div style={{
          padding: '24px', textAlign: 'center', borderRadius: '10px',
          border: `1px dashed ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: '"Mona Sans", sans-serif',
        }}>
          No skills yet. Click "Add Skill" to start.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((skill, idx) => (
          <div key={idx} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 70px 70px 1fr auto',
            gap: '8px', alignItems: 'end',
            padding: '12px', borderRadius: '10px',
            background: idx % 2 === 0 ? `${accent}04` : 'transparent',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}`,
          }}>
            {/* Name */}
            <div>
              {idx === 0 && <span style={labelStyle}>Skill Name</span>}
              <input value={skill.name || ''} onChange={e => update(idx, 'name', e.target.value)}
                placeholder="React" style={inputStyle} />
            </div>

            {/* Level */}
            <div>
              {idx === 0 && <span style={labelStyle}>Level</span>}
              <select value={skill.level || 3} onChange={e => update(idx, 'level', e.target.value)}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', textAlign: 'center' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}/5</option>
                ))}
              </select>
            </div>

            {/* Since */}
            <div>
              {idx === 0 && <span style={labelStyle}>Since</span>}
              <input type="number" value={skill.since || ''} onChange={e => update(idx, 'since', e.target.value)}
                placeholder="2024" style={inputStyle} min="2000" max="2030" />
            </div>

            {/* Description */}
            <div>
              {idx === 0 && <span style={labelStyle}>Description</span>}
              <input value={skill.desc || ''} onChange={e => update(idx, 'desc', e.target.value)}
                placeholder="Short description..." style={inputStyle} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '3px', paddingBottom: '1px' }}>
              <button onClick={() => moveUp(idx)} disabled={idx === 0} title="Move up" style={{
                padding: '5px', borderRadius: '4px', border: 'none', background: 'transparent',
                color: idx === 0 ? 'var(--border-color)' : 'var(--text-muted)', cursor: idx === 0 ? 'default' : 'pointer',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>
              </button>
              <button onClick={() => moveDown(idx)} disabled={idx >= items.length - 1} title="Move down" style={{
                padding: '5px', borderRadius: '4px', border: 'none', background: 'transparent',
                color: idx >= items.length - 1 ? 'var(--border-color)' : 'var(--text-muted)', cursor: idx >= items.length - 1 ? 'default' : 'pointer',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <button onClick={() => remove(idx)} title="Remove" style={{
                padding: '5px', borderRadius: '4px', border: 'none', background: 'transparent',
                color: '#ef4444', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSkillsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | category object
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const defaultForm = {
    categoryId: '', label: '', icon: '⬡', accent: '#52aeff',
    glow: 'rgba(82,174,255,0.15)', summary: '', order: 0, skills: [],
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminSkills.list();
    setCategories(data?.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...defaultForm }); setModal('create'); };
  const openEdit = (cat) => {
    setForm({
      _id: cat._id,
      categoryId: cat.categoryId || '',
      label: cat.label || '',
      icon: cat.icon || '⬡',
      accent: cat.accent || '#52aeff',
      glow: cat.glow || '',
      summary: cat.summary || '',
      order: cat.order || 0,
      skills: Array.isArray(cat.skills) ? cat.skills.map(s => ({ ...s })) : [],
    });
    setModal(cat);
  };
  const closeModal = () => { setModal(null); setForm({}); };

  const handleChange = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form };
    delete payload._id;
    if (typeof payload.order === 'string') payload.order = Number(payload.order) || 0;

    const result = modal === 'create'
      ? await adminSkills.create(payload)
      : await adminSkills.update(form._id, payload);
    setSaving(false);

    if (result.error) {
      setToast({ msg: typeof result.error === 'string' ? result.error : 'Save failed', type: 'error' });
    } else {
      setToast({ msg: modal === 'create' ? 'Category created!' : 'Updated!', type: 'success' });
      closeModal();
      load();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this skill category?')) return;
    await adminSkills.remove(id);
    setToast({ msg: 'Deactivated', type: 'success' });
    load();
  };

  const handleRestore = async (id) => {
    await adminSkills.restore(id);
    setToast({ msg: 'Restored!', type: 'success' });
    load();
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
    fontSize: '0.8rem', outline: 'none',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: accent, marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>Content Management</p>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.03em', margin: 0 }}>Skill Categories</h1>
        </div>
        <button onClick={openCreate} style={{
          padding: '9px 18px', borderRadius: '8px', border: 'none',
          background: accent, color: isDark ? '#000' : '#fff',
          fontFamily: '"Mona Sans", sans-serif', fontSize: '0.76rem', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
          boxShadow: `0 2px 12px ${accent}30`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Add Category
        </button>
      </div>

      {/* Count */}
      <div style={{ marginBottom: '16px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
        {loading ? 'Loading...' : `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'} · ${categories.reduce((a, c) => a + (c.skills?.length || 0), 0)} total skills`}
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {[1,2,3].map(i => <div key={i} style={{ height: '160px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
      ) : categories.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '14px', border: '1px dashed var(--border-color)', background: 'var(--bg-card)' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', fontSize: '0.85rem' }}>No skill categories yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {categories.map(cat => (
            <div key={cat._id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px',
              padding: '22px', transition: 'border-color 0.2s', position: 'relative',
              opacity: cat.isActive === false ? 0.5 : 1,
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${cat.accent || accent}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{cat.icon || '⬡'}</span>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', margin: 0, lineHeight: 1.2 }}>{cat.label}</h3>
                    <span style={{ fontSize: '0.58rem', color: cat.accent || accent, fontWeight: 600 }}>{cat.categoryId}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => openEdit(cat)} title="Edit" style={{
                    padding: '5px', borderRadius: '5px', border: '1px solid var(--border-color)',
                    background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  {cat.isActive === false ? (
                    <button onClick={() => handleRestore(cat._id)} title="Restore" style={{
                      padding: '5px', borderRadius: '5px', border: '1px solid rgba(34,197,94,0.2)',
                      background: 'transparent', color: '#22c55e', cursor: 'pointer', display: 'flex',
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8M21 3v5h-5" /></svg>
                    </button>
                  ) : (
                    <button onClick={() => handleDelete(cat._id)} title="Deactivate" style={{
                      padding: '5px', borderRadius: '5px', border: '1px solid rgba(239,68,68,0.15)',
                      background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', opacity: 0.5,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Summary */}
              {cat.summary && (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', lineHeight: 1.6, margin: '0 0 12px' }}>{cat.summary}</p>
              )}

              {/* Skills chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {(cat.skills || []).map((sk, i) => (
                  <span key={i} style={{
                    fontSize: '0.6rem', fontWeight: 600, padding: '3px 8px', borderRadius: '5px',
                    background: `${cat.accent || accent}10`, color: cat.accent || accent,
                    border: `1px solid ${cat.accent || accent}20`,
                    fontFamily: '"Mona Sans", sans-serif',
                  }}>
                    {sk.name} <span style={{ opacity: 0.6 }}>L{sk.level}</span>
                  </span>
                ))}
                {(!cat.skills || cat.skills.length === 0) && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', opacity: 0.5, fontFamily: '"Mona Sans", sans-serif' }}>No skills added</span>
                )}
              </div>

              {/* Color bar */}
              <div style={{ height: '3px', borderRadius: '2px', background: cat.accent || accent, marginTop: '14px', opacity: 0.4 }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4vh 1rem', overflowY: 'auto',
        }}>
          <div onClick={e => e.stopPropagation()} className="custom-scrollbar" style={{
            width: '100%', maxWidth: '780px',
            background: isDark ? '#0e0e14' : '#f0f4ff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '18px', padding: '32px',
            animation: 'adm-fadeIn 0.25s ease',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, marginBottom: '4px' }}>
                  {modal === 'create' ? 'Create' : 'Edit'}
                </p>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', margin: 0 }}>
                  Skill Category
                </h2>
              </div>
              <button onClick={closeModal} style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Category fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Category ID <span style={{ color: accent }}>*</span></label>
                <input value={form.categoryId || ''} onChange={e => handleChange('categoryId', e.target.value)} placeholder="frontend" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Label <span style={{ color: accent }}>*</span></label>
                <input value={form.label || ''} onChange={e => handleChange('label', e.target.value)} placeholder="Frontend & UI" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Icon</label>
                <input value={form.icon || ''} onChange={e => handleChange('icon', e.target.value)} placeholder="⬡" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Sort Order</label>
                <input type="number" value={form.order ?? 0} onChange={e => handleChange('order', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Accent Color</label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input type="color" value={form.accent || '#52aeff'} onChange={e => handleChange('accent', e.target.value)} style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer', padding: '2px' }} />
                  <input value={form.accent || ''} onChange={e => handleChange('accent', e.target.value)} placeholder="#52aeff" style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Glow Color</label>
                <input value={form.glow || ''} onChange={e => handleChange('glow', e.target.value)} placeholder="rgba(82,174,255,0.15)" style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Summary</label>
                <textarea value={form.summary || ''} onChange={e => handleChange('summary', e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0 20px' }} />

            {/* Nested skills editor */}
            <NestedSkillEditor
              skills={form.skills}
              onChange={(skills) => handleChange('skills', skills)}
              accent={form.accent || accent}
              isDark={isDark}
            />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={closeModal} style={{
                padding: '10px 22px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'transparent', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '10px 28px', borderRadius: '8px', border: 'none',
                background: accent, color: isDark ? '#000' : '#fff',
                fontFamily: '"Mona Sans", sans-serif', fontSize: '0.8rem', fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1,
                boxShadow: `0 2px 12px ${accent}30`,
              }}>
                {saving ? 'Saving...' : 'Save Category & Skills'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }`}</style>
    </div>
  );
}
