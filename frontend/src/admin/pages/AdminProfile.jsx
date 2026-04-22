import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { fetchAdminProfile, updateAdminProfile, uploadImage } from '../../services/api';

export default function AdminProfile() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await fetchAdminProfile();
      if (data?.data) setForm(data.data);
    })();
  }, []);

  const handleChange = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data, error } = await uploadImage(file, 'portfolio/avatars');
    setUploading(false);
    if (error) { setToast('Upload failed: ' + error); return; }
    handleChange('avatar', data?.data?.url || '');
    setToast('Avatar uploaded!');
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateAdminProfile(form);
    setSaving(false);
    setToast(error ? 'Save failed' : 'Profile saved!');
    setTimeout(() => setToast(''), 3000);
  };

  const fields = [
    [{ key: 'name', label: 'Full Name' }, { key: 'initials', label: 'Initials' }],
    [{ key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' }],
    [{ key: 'role', label: 'Role / Title' }, { key: 'roleAlt', label: 'Alternative Role' }],
    [{ key: 'tagline', label: 'Tagline', full: true }],
    [{ key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone' }],
    [{ key: 'location', label: 'Location' }, { key: 'locationShort', label: 'Short Location' }],
    [{ key: 'timezone', label: 'Timezone' }, { key: 'available', label: 'Open to Work', type: 'checkbox' }],
    [{ key: 'linkedin', label: 'LinkedIn URL', full: true }],
    [{ key: 'github', label: 'GitHub URL', full: true }],
    [{ key: 'resume', label: 'Resume URL', full: true }],
    [{ key: 'bio', label: 'Bio', type: 'textarea', full: true }],
  ];

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
    fontSize: '0.82rem', outline: 'none', transition: 'border-color 0.2s',
  };

  if (!form) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>Loading profile...</div>;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: accent, marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>Settings</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.03em', margin: 0 }}>Profile</h1>
      </div>

      {/* Avatar section */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px',
        padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden',
            border: `2px solid ${accent}30`, background: 'var(--bg-secondary)',
          }}>
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: accent }}>{form.initials || 'AK'}</div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', margin: '0 0 4px' }}>{form.name || 'Your Name'}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', margin: '0 0 12px' }}>{form.role || 'Your Role'}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
              padding: '7px 16px', borderRadius: '7px', border: `1px solid ${accent}30`,
              background: `${accent}0a`, color: accent, fontFamily: '"Mona Sans", sans-serif',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </button>
            <input type="text" value={form.avatar || ''} onChange={e => handleChange('avatar', e.target.value)}
              placeholder="or paste Cloudinary URL..." style={{ ...inputStyle, flex: 1, fontSize: '0.72rem' }} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {fields.map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: row.length === 1 || row[0].full ? '1fr' : '1fr 1fr', gap: '14px' }}>
              {row.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  ) : f.type === 'checkbox' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px 0' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '5px',
                        border: `2px solid ${form[f.key] ? accent : 'var(--border-color)'}`,
                        background: form[f.key] ? accent : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                      }}>
                        {form[f.key] && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#000' : '#fff'} strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                      </div>
                      <input type="checkbox" checked={!!form[f.key]} onChange={e => handleChange(f.key, e.target.checked)} style={{ display: 'none' }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif' }}>Yes</span>
                    </label>
                  ) : (
                    <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '11px 28px', borderRadius: '8px', border: 'none',
            background: accent, color: isDark ? '#000' : '#fff',
            fontFamily: '"Mona Sans", sans-serif', fontSize: '0.82rem', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1,
            boxShadow: `0 2px 12px ${accent}30`,
          }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          {toast && <span style={{ fontSize: '0.78rem', color: toast.includes('fail') ? '#ef4444' : '#22c55e', fontFamily: '"Mona Sans", sans-serif', fontWeight: 600 }}>{toast}</span>}
        </div>
      </div>
    </div>
  );
}
