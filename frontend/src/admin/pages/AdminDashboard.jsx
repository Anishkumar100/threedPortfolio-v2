import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { fetchDashboard, fetchAdminAnalytics } from '../../services/api';

const STATS_CONFIG = [
  { key: 'totalServices', label: 'Active Services', color: '#52aeff', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2' },
  { key: 'totalInquiries', label: 'Total Inquiries', color: '#a78bfa', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2' },
  { key: 'unreadMessages', label: 'Unread Messages', color: '#f59e0b', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'monthlyViews', label: 'Monthly Views', color: '#34d399', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { key: 'weeklyViews', label: 'Weekly Views', color: '#fb7185', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10' },
];

const QUICK_LINKS = [
  { label: 'Projects', path: '/admin/projects', desc: 'Manage portfolio work' },
  { label: 'Services', path: '/admin/services', desc: 'Edit service offerings' },
  { label: 'Messages', path: '/admin/messages', desc: 'Read contact messages' },
  { label: 'Inquiries', path: '/admin/inquiries', desc: 'View service inquiries' },
  { label: 'Profile', path: '/admin/profile', desc: 'Update your info' },
  { label: 'Site Config', path: '/admin/config', desc: 'Stats, values, hobbies...' },
  { label: 'Analytics', path: '/admin/analytics', desc: 'Traffic & events' },
  { label: 'Maintenance', path: '/admin/maintenance', desc: 'Toggle maintenance mode' },
];

export default function AdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, a] = await Promise.all([fetchDashboard(), fetchAdminAnalytics(7)]);
      if (s.data) setStats(s.data.data);
      if (a.data) setAnalytics(a.data.data);
      setLoading(false);
    })();
  }, []);

  const maxBar = analytics?.dailyTrend?.length > 0 ? Math.max(...analytics.dailyTrend.map(d => d.count), 1) : 1;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: accent, marginBottom: '8px', fontFamily: '"Mona Sans", sans-serif' }}>Dashboard</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.04em', margin: '0 0 6px', lineHeight: 1.1 }}>
          Welcome back<span style={{ color: accent }}>.</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
          Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ height: '92px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i*0.08}s` }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {STATS_CONFIG.map(s => (
            <div key={s.key} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px',
              padding: '20px', display: 'flex', alignItems: 'center', gap: '14px',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
              </div>
              <div>
                <p style={{ fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', lineHeight: 1, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{stats?.[s.key] ?? 0}</p>
                <p style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', margin: '3px 0 0' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two-column: Trend + Top pages */}
      {!loading && analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {/* Daily trend */}
          {analytics.dailyTrend?.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px' }}>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: '"Mona Sans", sans-serif' }}>7-Day Trend</p>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '100px' }}>
                {analytics.dailyTrend.map((d, i) => (
                  <div key={i} title={`${d.date}: ${d.count} events`} style={{
                    flex: 1, borderRadius: '4px 4px 0 0',
                    background: `linear-gradient(to top, ${accent}, ${accent}80)`,
                    height: `${Math.max((d.count / maxBar) * 100, 6)}%`,
                    transition: 'height 0.4s ease', cursor: 'default',
                    minWidth: '6px',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>{analytics.dailyTrend[0]?.date?.slice(5)}</span>
                <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>{analytics.dailyTrend[analytics.dailyTrend.length-1]?.date?.slice(5)}</span>
              </div>
            </div>
          )}

          {/* Top pages */}
          {analytics.topPages?.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px' }}>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px', fontFamily: '"Mona Sans", sans-serif' }}>Top Pages</p>
              {analytics.topPages.slice(0, 6).map((p, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: i < Math.min(analytics.topPages.length, 6) - 1 ? '1px solid var(--border-color)' : 'none',
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', fontWeight: 500 }}>/{p.page}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: accent, fontFamily: '"Mona Sans", sans-serif', fontVariantNumeric: 'tabular-nums' }}>{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px', fontFamily: '"Mona Sans", sans-serif' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '10px' }}>
          {QUICK_LINKS.map(q => (
            <Link key={q.path} to={q.path} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: '10px', textDecoration: 'none',
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              transition: 'all 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}35`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', display: 'block' }}>{q.label}</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>{q.desc}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.6 }}><path d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }`}</style>
    </div>
  );
}
