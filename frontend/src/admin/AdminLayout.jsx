import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { type: 'divider', label: 'Content' },
  { label: 'Projects', path: '/admin/projects', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { label: 'Services', path: '/admin/services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Skills', path: '/admin/skills', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { label: 'Experience', path: '/admin/experience', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { label: 'Education', path: '/admin/education', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { label: 'Leadership', path: '/admin/leadership', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { label: 'Testimonials', path: '/admin/testimonials', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { type: 'divider', label: 'Comms' },
  { label: 'Messages', path: '/admin/messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Inquiries', path: '/admin/inquiries', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { type: 'divider', label: 'Settings' },
  { label: 'Profile', path: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { label: 'Site Config', path: '/admin/config', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { label: 'Maintenance', path: '/admin/maintenance', icon: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93s.844.083 1.207-.174l.723-.534a1.131 1.131 0 011.555.167l.774.774c.41.41.476 1.04.167 1.555l-.534.723c-.257.363-.258.811-.174 1.207s.506.71.93.78l.894.15c.542.09.94.56.94 1.109v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.384-.93.78s-.083.844.174 1.207l.534.723a1.131 1.131 0 01-.167 1.555l-.774.774a1.131 1.131 0 01-1.555.167l-.723-.534c-.363-.257-.811-.258-1.207-.174s-.71.506-.78.93l-.15.894c-.09.542-.56.94-1.109.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93s-.844-.083-1.207.174l-.723.534a1.131 1.131 0 01-1.555-.167l-.774-.774a1.131 1.131 0 01-.167-1.555l.534-.723c.257-.363.258-.811.174-1.207s-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.148c.424-.071.764-.384.93-.781s.083-.844-.174-1.207l-.534-.723a1.131 1.131 0 01.167-1.555l.774-.774a1.131 1.131 0 011.555-.167l.723.534c.363.257.811.258 1.207.174s.71-.506.78-.93l.15-.894zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

const ADMIN_CSS = `
  .adm-sidebar::-webkit-scrollbar { width: 0; height: 0; }
  .adm-sidebar { scrollbar-width: none; -ms-overflow-style: none; }
  .adm-main::-webkit-scrollbar { width: 5px; }
  .adm-main::-webkit-scrollbar-track { background: transparent; }
  .adm-main::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
  .adm-main::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  .adm-link { transition: all 0.18s cubic-bezier(0.4,0,0.2,1) !important; }
  .adm-link:hover .adm-dot { transform: scale(1); opacity: 1; }
  @keyframes adm-fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .adm-page-enter { animation: adm-fadeIn 0.35s ease both; }
`;

function NavIcon({ d }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAdminAuth();
  const location = useLocation();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';
  const [collapsed, setCollapsed] = useState(false);
  const sideW = collapsed ? '64px' : '230px';

  useEffect(() => {
    if (!document.getElementById('adm-css')) {
      const s = document.createElement('style');
      s.id = 'adm-css';
      s.textContent = ADMIN_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: '"Mona Sans", sans-serif' }}>
      {/* ── Sidebar ── */}
      <aside className="adm-sidebar" style={{
        width: sideW, flexShrink: 0,
        background: isDark ? 'rgba(8,8,14,0.95)' : 'rgba(232,237,247,0.95)',
        borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
        overflowX: 'hidden', overflowY: 'auto',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '16px 12px' : '18px 16px',
          display: 'flex', alignItems: 'center', gap: '10px',
          minHeight: '60px', position: 'sticky', top: 0, zIndex: 2,
          background: isDark ? 'rgba(8,8,14,0.98)' : 'rgba(232,237,247,0.98)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', background: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: `0 0 18px ${accent}40`,
          }}>
            <span style={{ fontWeight: 900, fontSize: '0.72rem', color: isDark ? '#000' : '#fff', lineHeight: 1 }}>AK</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>Admin</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em' }}>Portfolio CMS</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? '4px 6px' : '4px 10px' }}>
          {NAV.map((item, i) => {
            if (item.type === 'divider') {
              return collapsed ? (
                <div key={i} style={{ height: '1px', background: 'var(--border-color)', margin: '10px 6px', opacity: 0.4 }} />
              ) : (
                <div key={i} style={{ padding: '16px 8px 6px', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, opacity: 0.6 }}>{item.label}</span>
                </div>
              );
            }
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} className="adm-link" style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: collapsed ? '10px' : '8px 10px',
                borderRadius: '8px', textDecoration: 'none', marginBottom: '1px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                background: active ? `${accent}12` : 'transparent',
                color: active ? accent : 'var(--text-muted)',
                fontSize: '0.76rem', fontWeight: active ? 700 : 500,
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
                title={collapsed ? item.label : undefined}
              >
                {/* Active indicator bar */}
                {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', borderRadius: '0 3px 3px 0', background: accent }} />}
                <NavIcon d={item.icon} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{
          padding: collapsed ? '10px 6px' : '10px',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
          display: 'flex', flexDirection: 'column', gap: '3px',
          position: 'sticky', bottom: 0, zIndex: 2,
          background: isDark ? 'rgba(8,8,14,0.98)' : 'rgba(232,237,247,0.98)',
          backdropFilter: 'blur(12px)',
        }}>
          {[
            { onClick: () => setCollapsed(c => !c), icon: collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7', label: 'Collapse', color: 'var(--text-muted)' },
            { onClick: toggleTheme, icon: null, emoji: isDark ? '🌙' : '☀️', label: isDark ? 'Dark' : 'Light', color: 'var(--text-muted)' },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick} style={{
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '8px',
              padding: '7px 8px', borderRadius: '7px', border: 'none',
              background: 'transparent', color: btn.color, cursor: 'pointer', fontSize: '0.68rem',
              fontWeight: 500, width: '100%', fontFamily: '"Mona Sans", sans-serif',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {btn.emoji ? <span style={{ fontSize: '13px', width: '17px', textAlign: 'center' }}>{btn.emoji}</span> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={btn.icon} /></svg>}
              {!collapsed && btn.label}
            </button>
          ))}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '8px',
            padding: '7px 8px', borderRadius: '7px', textDecoration: 'none',
            background: 'transparent', color: accent, fontSize: '0.68rem', fontWeight: 600,
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = `${accent}0a`}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
            {!collapsed && 'View Site'}
          </Link>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '8px',
            padding: '7px 8px', borderRadius: '7px', border: 'none',
            background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.68rem',
            fontWeight: 600, width: '100%', fontFamily: '"Mona Sans", sans-serif',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="adm-main" style={{
        flex: 1, marginLeft: sideW,
        transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
        minHeight: '100vh', overflowY: 'auto',
      }}>
        <div className="adm-page-enter" key={location.pathname} style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(24px, 4vw, 48px)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
