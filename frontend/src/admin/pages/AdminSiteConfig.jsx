import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { fetchAdminConfig, updateAdminConfig, uploadImage } from '../../services/api';

const SECTIONS = [
  { key: 'aboutStats', label: 'About Page Stats', fields: ['value', 'label'] },
  { key: 'heroStats', label: 'Skills Page Stats', fields: ['value', 'label'] },
  { key: 'quickFacts', label: 'Quick Facts', fields: ['icon', 'label', 'value'] },
  { key: 'values', label: 'Values / Philosophy', fields: ['icon', 'title', 'body'] },
  { key: 'hobbies', label: 'Hobbies', fields: ['id', 'icon', 'title', 'description', 'tag'] },
  { key: 'achievements', label: 'Achievements', fields: ['id', 'title', 'body', 'icon', 'year'] },
  { key: 'currentlyLearning', label: 'Currently Learning', fields: ['label', 'progress', 'color'] },
  { key: 'counterItems', label: 'Home Stats Bar', fields: ['value', 'suffix', 'label'] },
  { key: 'abilities', label: 'Abilities Section', fields: ['imgPath', 'title', 'desc'] },
  { key: 'socialLinks', label: 'Social Links', fields: ['name', 'url', 'imgPath'] },
  { key: 'words', label: 'Hero Carousel Words', fields: ['text', 'imgPath'] },
  { key: 'logoIcons', label: 'Logo Icons (Marquee)', fields: ['imgPath'] },
];

function MiniUpload({ value, onChange, accent }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const { data, error } = await uploadImage(file, 'portfolio/config');
    setBusy(false);
    if (!error && data?.data?.url) onChange(data.data.url);
    else alert('Upload failed');
  };
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
        placeholder="URL or upload →" style={{
          flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)',
          background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
          fontSize: '0.72rem', outline: 'none', minWidth: '0',
        }} />
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <button onClick={() => ref.current?.click()} disabled={busy} title="Upload to Cloudinary" style={{
        padding: '5px 8px', borderRadius: '5px', border: `1px solid ${accent}25`,
        background: 'transparent', color: accent, cursor: 'pointer', fontSize: '0.6rem', fontWeight: 700,
        whiteSpace: 'nowrap', opacity: busy ? 0.4 : 1,
      }}>
        {busy ? '...' : '↑'}
      </button>
    </div>
  );
}

function SectionEditor({ sectionKey, fields, data, onChange, accent }) {
  const items = data || [];
  const isImgField = (f) => /img|image|avatar|logo|photo/i.test(f);

  const updateItem = (idx, field, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: (field === 'progress' || (field === 'value' && sectionKey === 'counterItems')) ? Number(value) || value : value };
    onChange(sectionKey, updated);
  };

  const addItem = () => {
    const newItem = {};
    fields.forEach(f => { newItem[f] = ''; });
    onChange(sectionKey, [...items, newItem]);
  };

  const removeItem = (idx) => {
    onChange(sectionKey, items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {items.length === 0 && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', padding: '20px 0', textAlign: 'center', opacity: 0.6 }}>
          Empty. Click "Add Item" below.
        </p>
      )}

      {items.map((item, idx) => (
        <div key={idx} style={{
          display: 'grid', gridTemplateColumns: `repeat(${fields.length}, 1fr) 36px`,
          gap: '6px', alignItems: 'end', marginBottom: '6px',
          padding: '10px', borderRadius: '8px',
          background: idx % 2 === 0 ? (accent + '04') : 'transparent',
        }}>
          {fields.map(f => (
            <div key={f} style={{ minWidth: 0 }}>
              {idx === 0 && <span style={{ fontSize: '0.46rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '3px' }}>{f}</span>}
              {isImgField(f) ? (
                <MiniUpload value={item[f] ?? ''} onChange={v => updateItem(idx, f, v)} accent={accent} />
              ) : (
                <input value={item[f] ?? ''} onChange={e => updateItem(idx, f, e.target.value)} style={{
                  width: '100%', padding: '6px 8px', borderRadius: '6px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
                  fontSize: '0.72rem', outline: 'none',
                }} />
              )}
            </div>
          ))}
          <button onClick={() => removeItem(idx)} title="Remove" style={{
            padding: '5px', borderRadius: '5px', border: 'none',
            background: 'transparent', color: '#ef4444', cursor: 'pointer',
            opacity: 0.4, transition: 'opacity 0.15s', alignSelf: 'end', marginBottom: '1px',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
      ))}

      <button onClick={addItem} style={{
        marginTop: '10px', padding: '7px 16px', borderRadius: '7px', border: `1px dashed ${accent}40`,
        background: 'transparent', color: accent, cursor: 'pointer', fontFamily: '"Mona Sans", sans-serif',
        fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Add Item
      </button>
    </div>
  );
}

export default function AdminSiteConfig() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState(SECTIONS[0].key);

  useEffect(() => {
    (async () => {
      const { data } = await fetchAdminConfig();
      if (data?.data) setConfig(data.data);
    })();
  }, []);

  const handleChange = (key, value) => setConfig(p => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {};
    SECTIONS.forEach(s => { payload[s.key] = config[s.key]; });
    const { error } = await updateAdminConfig(payload);
    setSaving(false);
    setToast(error ? 'Save failed' : 'Saved!');
    setTimeout(() => setToast(''), 3000);
  };

  if (!config) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>Loading configuration...</div>;

  const activeSection = SECTIONS.find(s => s.key === activeTab);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: accent, marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>Settings</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.03em', margin: '0 0 6px' }}>Site Configuration</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
          Edit every configurable section — stats, values, hobbies, icons, and more.
        </p>
      </div>

      {/* Tabs */}
      <div className="custom-scrollbar" style={{ display: 'flex', gap: '4px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setActiveTab(s.key)} style={{
            padding: '7px 14px', borderRadius: '7px', whiteSpace: 'nowrap',
            border: `1px solid ${activeTab === s.key ? accent : 'transparent'}`,
            background: activeTab === s.key ? `${accent}12` : 'transparent',
            color: activeTab === s.key ? accent : 'var(--text-muted)',
            fontFamily: '"Mona Sans", sans-serif', fontSize: '0.66rem', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', margin: 0 }}>
            {activeSection?.label}
          </h3>
          <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', background: `${accent}10`, color: accent, fontWeight: 600 }}>
            {config[activeTab]?.length || 0} items
          </span>
        </div>

        {activeSection && (
          <SectionEditor
            sectionKey={activeSection.key}
            fields={activeSection.fields}
            data={config[activeSection.key]}
            onChange={handleChange}
            accent={accent}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '11px 28px', borderRadius: '8px', border: 'none',
            background: accent, color: isDark ? '#000' : '#fff',
            fontFamily: '"Mona Sans", sans-serif', fontSize: '0.82rem', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1,
            boxShadow: `0 2px 12px ${accent}30`,
          }}>
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          {toast && <span style={{ fontSize: '0.78rem', color: toast.includes('fail') ? '#ef4444' : '#22c55e', fontFamily: '"Mona Sans", sans-serif', fontWeight: 600 }}>{toast}</span>}
        </div>
      </div>
    </div>
  );
}
