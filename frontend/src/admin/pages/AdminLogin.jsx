import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { theme } = useTheme();
  const { admin, login } = useAdminAuth();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) setError(typeof result.error === 'string' ? result.error : 'Invalid credentials');
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1px solid var(--border-color)', background: 'var(--bg-card)',
    color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif',
    fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: `0 0 24px ${accent}40`,
          }}>
            <span style={{ fontWeight: 900, fontSize: '1rem', color: isDark ? '#000' : '#fff', fontFamily: '"Mona Sans", sans-serif' }}>AK</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.03em', margin: '0 0 6px' }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
            Sign in to manage your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem', fontFamily: '"Mona Sans", sans-serif' }}>
              {error}
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" style={inputStyle}
              onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle}
              onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
            background: accent, color: isDark ? '#000' : '#fff',
            fontFamily: '"Mona Sans", sans-serif', fontSize: '0.85rem', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease', letterSpacing: '0.04em',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
