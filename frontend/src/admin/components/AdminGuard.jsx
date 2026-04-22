import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminGuard({ children }) {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif', fontSize: '0.85rem' }}>Loading...</div>
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
