import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { uploadImage } from '../../services/api';

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
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {isOk ? <><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></> : <><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></>}
      </svg>
      {msg}
    </div>
  );
}

function ImageUploadField({ value, onChange, accent, isDark, label }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data, error } = await uploadImage(file, 'portfolio');
    setUploading(false);
    if (error) { alert('Upload failed: ' + error); return; }
    onChange(data?.data?.url || '');
  };

  return (
    <div>
      {/* Preview */}
      {value && /^https?:\/\//.test(value) && (
        <div style={{ marginBottom: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', maxWidth: '200px' }}>
          <img src={value} alt="preview" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '120px', objectFit: 'cover' }}
            onError={e => e.target.style.display = 'none'} />
        </div>
      )}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input
          type="text" value={value || ''} onChange={e => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          style={{
            flex: 1, padding: '9px 12px', borderRadius: '8px',
            border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
            color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
            fontSize: '0.78rem', outline: 'none',
          }}
        />
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
          padding: '8px 14px', borderRadius: '8px', border: `1px solid ${accent}30`,
          background: `${accent}0a`, color: accent, cursor: 'pointer',
          fontFamily: '"Mona Sans", sans-serif', fontSize: '0.68rem', fontWeight: 700,
          whiteSpace: 'nowrap', opacity: uploading ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          {uploading ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93"/></svg> Uploading</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg> Upload</>
          )}
        </button>
      </div>
    </div>
  );
}

const isImageField = (key) => /image|img|avatar|photo|logo|screenshot/i.test(key);

export default function AdminCrudPage({ title, subtitle, api, columns, formFields, defaultValues = {}, showStatus = true }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaultValues);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  const load = useCallback(async () => {
    setLoading(true);
    // Default: load ALL items for admin, let the filter be applied client-side
    const { data, error } = await api.list();
    if (error) {
      console.error('Failed to load:', error);
      setItems([]);
    } else {
      setItems(data?.data || []);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? items :
    filter === 'active' ? items.filter(i => i.isActive !== false) :
    items.filter(i => i.isActive === false);

  const openCreate = () => { setForm({ ...defaultValues }); setModal('create'); };
  const openEdit = (item) => {
    const f = {};
    formFields.forEach(ff => {
      const v = item[ff.key];
      if (ff.type === 'array') f[ff.key] = Array.isArray(v) ? v.join(', ') : '';
      else f[ff.key] = v ?? defaultValues[ff.key] ?? '';
    });
    f._id = item._id;
    setForm(f);
    setModal(item);
  };
  const closeModal = () => { setModal(null); setForm(defaultValues); };
  const handleChange = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form };
    delete payload._id;
    formFields.forEach(ff => {
      if (ff.type === 'array' && typeof payload[ff.key] === 'string') {
        payload[ff.key] = payload[ff.key].split(',').map(s => s.trim()).filter(Boolean);
      }
      if (ff.type === 'number' && payload[ff.key] !== '' && payload[ff.key] !== undefined) {
        payload[ff.key] = Number(payload[ff.key]);
      }
      if (ff.type === 'checkbox') payload[ff.key] = !!payload[ff.key];
    });
    const result = modal === 'create' ? await api.create(payload) : await api.update(form._id, payload);
    setSaving(false);
    if (result.error) {
      setToast({ msg: typeof result.error === 'string' ? result.error : 'Save failed', type: 'error' });
    } else {
      setToast({ msg: modal === 'create' ? 'Created!' : 'Updated!', type: 'success' });
      closeModal();
      load();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Move to inactive?')) return;
    const { error } = await api.remove(id);
    if (error) setToast({ msg: 'Failed', type: 'error' });
    else { setToast({ msg: 'Moved to inactive', type: 'success' }); load(); }
  };

  const handleRestore = async (id) => {
    const { error } = await api.restore(id);
    if (error) setToast({ msg: 'Restore failed', type: 'error' });
    else { setToast({ msg: 'Restored!', type: 'success' }); load(); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
    fontSize: '0.8rem', outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: accent, marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>{subtitle || `Manage ${title}`}</p>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.03em', margin: 0 }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {showStatus && (
            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              {['all', 'active', 'inactive'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '7px 12px', border: 'none',
                  background: filter === f ? `${accent}14` : 'transparent',
                  color: filter === f ? accent : 'var(--text-muted)',
                  fontFamily: '"Mona Sans", sans-serif', fontSize: '0.66rem', fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize',
                }}>
                  {f}
                </button>
              ))}
            </div>
          )}
          <button onClick={openCreate} style={{
            padding: '9px 18px', borderRadius: '8px', border: 'none',
            background: accent, color: isDark ? '#000' : '#fff',
            fontFamily: '"Mona Sans", sans-serif', fontSize: '0.76rem', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
            boxShadow: `0 2px 12px ${accent}30`,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Add
          </button>
        </div>
      </div>

      {/* Count */}
      <div style={{ marginBottom: '16px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
        {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
        {!loading && filter !== 'all' && ` (${filter})`}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: '56px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px', borderRadius: '14px',
          border: `1px dashed ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
          background: 'var(--bg-card)',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" style={{ margin: '0 auto 14px', opacity: 0.3 }}>
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', fontSize: '0.85rem', margin: 0 }}>
            No {title.toLowerCase()} found
          </p>
          <button onClick={openCreate} style={{
            marginTop: '16px', padding: '8px 20px', borderRadius: '8px', border: 'none',
            background: `${accent}14`, color: accent, fontFamily: '"Mona Sans", sans-serif',
            fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer',
          }}>
            Create your first {title.replace(/s$/, '').toLowerCase()}
          </button>
        </div>
      ) : (
        <div style={{ borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--bg-card)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Mona Sans", sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid var(--border-color)` }}>
                  {columns.map(col => (
                    <th key={col.key} style={{
                      textAlign: 'left', padding: '14px 16px', fontSize: '0.54rem', fontWeight: 700,
                      letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)',
                      width: col.width || 'auto', whiteSpace: 'nowrap', opacity: 0.7,
                    }}>{col.label}</th>
                  ))}
                  {showStatus && <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', width: '75px', opacity: 0.7 }}>Status</th>}
                  <th style={{ padding: '14px 16px', width: '100px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={item._id} style={{
                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-color)' : 'none',
                    transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{ padding: '13px 16px', fontSize: '0.8rem', color: 'var(--text-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {col.render ? col.render(item[col.key], item) :
                          isImageField(col.key) && item[col.key] && /^https?:\/\//.test(item[col.key]) ? (
                            <img src={item[col.key]} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} onError={e => { e.target.style.display = 'none'; }} />
                          ) :
                          Array.isArray(item[col.key]) ? item[col.key].slice(0, 3).join(', ') + (item[col.key].length > 3 ? '...' : '') :
                          typeof item[col.key] === 'boolean' ? (item[col.key] ? '✓ Yes' : '—') :
                          String(item[col.key] ?? '—')
                        }
                      </td>
                    ))}
                    {showStatus && (
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          fontSize: '0.58rem', fontWeight: 700, padding: '3px 8px', borderRadius: '5px',
                          background: item.isActive !== false ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                          color: item.isActive !== false ? '#22c55e' : '#ef4444',
                        }}>
                          {item.isActive !== false ? 'Live' : 'Off'}
                        </span>
                      </td>
                    )}
                    <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEdit(item)} title="Edit" style={{
                          padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)',
                          background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        {item.isActive === false ? (
                          <button onClick={() => handleRestore(item._id)} title="Restore" style={{
                            padding: '6px', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)',
                            background: 'transparent', color: '#22c55e', cursor: 'pointer', display: 'flex',
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8M21 3v5h-5" /></svg>
                          </button>
                        ) : (
                          <button onClick={() => handleDelete(item._id)} title="Deactivate" style={{
                            padding: '6px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.15)',
                            background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex',
                            opacity: 0.6, transition: 'opacity 0.15s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '5vh 1rem', overflowY: 'auto',
        }}>
          <div onClick={e => e.stopPropagation()} className="custom-scrollbar" style={{
            width: '100%', maxWidth: '620px',
            background: isDark ? '#0e0e14' : '#f0f4ff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '18px', padding: '32px',
            animation: 'adm-fadeIn 0.25s ease',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, marginBottom: '4px' }}>
                  {modal === 'create' ? 'Create New' : 'Edit'}
                </p>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.02em', margin: 0 }}>
                  {title.replace(/s$/, '')}
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

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {formFields.map(ff => (
                <div key={ff.key}>
                  <label style={{
                    display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px',
                    fontFamily: '"Mona Sans", sans-serif',
                  }}>
                    {ff.label}{ff.required && <span style={{ color: accent }}> *</span>}
                  </label>

                  {/* Image field with Cloudinary upload */}
                  {isImageField(ff.key) ? (
                    <ImageUploadField
                      value={form[ff.key] || ''}
                      onChange={v => handleChange(ff.key, v)}
                      accent={accent} isDark={isDark} label={ff.label}
                    />
                  ) : ff.type === 'textarea' ? (
                    <textarea value={form[ff.key] || ''} onChange={e => handleChange(ff.key, e.target.value)}
                      rows={ff.rows || 4} placeholder={ff.placeholder || ''}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  ) : ff.type === 'select' ? (
                    <select value={form[ff.key] || ''} onChange={e => handleChange(ff.key, e.target.value)}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '32px',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23839cb5' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                      }}>
                      <option value="">Select...</option>
                      {(ff.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : ff.type === 'checkbox' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 0' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '5px',
                        border: `2px solid ${form[ff.key] ? accent : 'var(--border-color)'}`,
                        background: form[ff.key] ? accent : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s', flexShrink: 0,
                      }}>
                        {form[ff.key] && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#000' : '#fff'} strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                      </div>
                      <input type="checkbox" checked={!!form[ff.key]} onChange={e => handleChange(ff.key, e.target.checked)} style={{ display: 'none' }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif' }}>{ff.checkLabel || 'Enabled'}</span>
                    </label>
                  ) : ff.type === 'array' ? (
                    <div>
                      <input value={form[ff.key] || ''} onChange={e => handleChange(ff.key, e.target.value)}
                        placeholder="Comma-separated values" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = accent}
                        onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', opacity: 0.6, marginTop: '3px', display: 'block' }}>Separate items with commas</span>
                    </div>
                  ) : (
                    <input type={ff.type || 'text'} value={form[ff.key] ?? ''} onChange={e => handleChange(ff.key, e.target.value)}
                      placeholder={ff.placeholder || ''} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  )}
                </div>
              ))}
            </div>

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
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
