import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { adminLogin as apiLogin } from '../services/api';

const AdminAuthContext = createContext({ admin: null, login: async () => {}, logout: () => {}, loading: true });

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const email = localStorage.getItem('admin_email');
    if (token && email) {
      setAdmin({ email, token });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await apiLogin(email, password);
    if (error) return { error };
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_refresh_token', data.refreshToken);
    localStorage.setItem('admin_email', email);
    setAdmin({ email, token: data.token });
    return { error: null };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_email');
    setAdmin(null);
  }, []);

  const value = useMemo(() => ({ admin, login, logout, loading }), [admin, login, logout, loading]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export const useAdminAuth = () => useContext(AdminAuthContext);
