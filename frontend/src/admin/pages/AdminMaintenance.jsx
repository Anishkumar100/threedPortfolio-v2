import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { fetchAdminMaintenance, updateAdminMaintenance } from '../../services/api';

export default function AdminMaintenance() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    (async () => {
      const { data: res } = await fetchAdminMaintenance();
      if (res?.data) setData(res.data);
    })();
  }, []);

  const handleChange = (key, value) => setData(p => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      isEnabled: data.isEnabled,
      message: data.message,
      estimatedEnd: data.estimatedEnd || null,
      allowedIPs: typeof data.allowedIPs === 'string' ? data.allowedIPs.split(',').map(s => s.trim()).filter(Boolean) : data.allowedIPs,
    };
    const { error } = await updateAdminMaintenance(payload);
    setSaving(false);
    setToast(error ? 'Failed to update' : 'Maintenance settings saved!');
    setTimeout(() => setToast(''), 3000);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
    fontSize: '0.82rem', outline: 'none',
  };

  if (!data) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>Settings</p>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.03em', margin: 0 }}>Maintenance Mode</h1>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '28px', maxWidth: '600px' }}>
        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '16px', borderRadius: '10px', background: data.isEnabled ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)', border: `1px solid ${data.isEnabled ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}` }}>
          <div>
            <p style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', margin: '0 0 4px' }}>
              {data.isEnabled ? 'Maintenance Mode is ON' : 'Maintenance Mode is OFF'}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', margin: 0 }}>
              {data.isEnabled ? 'All public routes return 503. Only admin panel and allowed IPs can access.' : 'Site is live and accessible to everyone.'}
            </p>
          </div>
          <label style={{ position: 'relative', width: '52px', height: '28px', cursor: 'pointer', flexShrink: 0 }}>
            <input type="checkbox" checked={data.isEnabled} onChange={e => handleChange('isEnabled', e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '14px',
              background: data.isEnabled ? '#ef4444' : '#22c55e',
              transition: 'background 0.2s',
            }} />
            <span style={{
              position: 'absolute', top: '3px', width: '22px', height: '22px', borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s',
              left: data.isEnabled ? '27px' : '3px',
            }} />
          </label>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Message</label>
            <textarea value={data.message || ''} onChange={e => handleChange('message', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Estimated End (ISO date)</label>
            <input type="datetime-local" value={data.estimatedEnd ? new Date(data.estimatedEnd).toISOString().slice(0, 16) : ''} onChange={e => handleChange('estimatedEnd', e.target.value ? new Date(e.target.value).toISOString() : null)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: '"Mona Sans", sans-serif' }}>Allowed IPs (comma-separated)</label>
            <input value={Array.isArray(data.allowedIPs) ? data.allowedIPs.join(', ') : data.allowedIPs || ''} onChange={e => handleChange('allowedIPs', e.target.value)} placeholder="127.0.0.1, 192.168.1.1" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '11px 28px', borderRadius: '8px', border: 'none',
            background: accent, color: isDark ? '#000' : '#fff',
            fontFamily: '"Mona Sans", sans-serif', fontSize: '0.82rem', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {toast && <span style={{ fontSize: '0.78rem', color: toast.includes('fail') || toast.includes('Failed') ? '#ef4444' : '#22c55e', fontFamily: '"Mona Sans", sans-serif', fontWeight: 600 }}>{toast}</span>}
        </div>
      </div>
    </div>
  );
}
