import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { fetchAdminAnalytics } from '../../services/api';

export default function AdminAnalytics() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? '#52aeff' : '#d4200c';
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: res } = await fetchAdminAnalytics(days);
      if (res?.data) setData(res.data);
      setLoading(false);
    })();
  }, [days]);

  const maxBarValue = data?.dailyTrend?.length > 0 ? Math.max(...data.dailyTrend.map(d => d.count)) : 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, marginBottom: '6px', fontFamily: '"Mona Sans", sans-serif' }}>Analytics</p>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.03em', margin: 0 }}>Analytics Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[7, 14, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              padding: '7px 14px', borderRadius: '7px',
              border: `1px solid ${days === d ? accent : 'var(--border-color)'}`,
              background: days === d ? `${accent}14` : 'transparent',
              color: days === d ? accent : 'var(--text-muted)',
              fontFamily: '"Mona Sans", sans-serif', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
            }}>{d}d</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>Loading analytics...</div>
      ) : !data ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>Failed to load analytics.</div>
      ) : (
        <>
          {/* Page views stat */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px', marginBottom: '20px', display: 'inline-block' }}>
            <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', marginBottom: '4px' }}>Total Page Views ({days}d)</p>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: accent, fontFamily: '"Mona Sans", sans-serif', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{data.pageViews}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Daily trend */}
            {data.dailyTrend?.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', marginBottom: '16px' }}>Daily Trend</h3>
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '120px' }}>
                  {data.dailyTrend.map((d, i) => (
                    <div key={i} title={`${d.date}: ${d.count}`} style={{
                      flex: 1, minWidth: '4px', borderRadius: '3px 3px 0 0',
                      background: accent, opacity: 0.7,
                      height: `${Math.max((d.count / maxBarValue) * 100, 4)}%`,
                      transition: 'height 0.3s ease',
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>{data.dailyTrend[0]?.date}</span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>{data.dailyTrend[data.dailyTrend.length - 1]?.date}</span>
                </div>
              </div>
            )}

            {/* Top pages */}
            {data.topPages?.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', marginBottom: '12px' }}>Top Pages</h3>
                {data.topPages.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.topPages.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif' }}>/{p.page}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: accent, fontFamily: '"Mona Sans", sans-serif', fontVariantNumeric: 'tabular-nums' }}>{p.count}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Event breakdown */}
            {data.eventBreakdown?.length > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', marginBottom: '12px' }}>Events</h3>
                {data.eventBreakdown.map((e, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.eventBreakdown.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif' }}>{e.event}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: accent, fontFamily: '"Mona Sans", sans-serif', fontVariantNumeric: 'tabular-nums' }}>{e.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CSV export */}
          <div style={{ marginTop: '24px' }}>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/analytics/export?days=${days}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'transparent', color: 'var(--text-muted)',
                fontFamily: '"Mona Sans", sans-serif', fontSize: '0.78rem', fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Export CSV ({days} days)
            </a>
          </div>
        </>
      )}
    </div>
  );
}
