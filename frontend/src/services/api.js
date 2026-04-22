const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('admin_token');

const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (options.auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options, signal: controller.signal, headers,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) return { data: null, error: data.error || data.errors || `Error ${res.status}` };
    return { data, error: null };
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') return { data: null, error: 'Request timed out' };
    return { data: null, error: err.message || 'Network error' };
  }
};

// ─── Public ──────────────────────────────────────────────────────────────────
export const fetchServices = (params = {}) => {
  const q = new URLSearchParams();
  if (params.category) q.set('category', params.category);
  if (params.featured) q.set('featured', 'true');
  const qs = q.toString();
  return request(`/services${qs ? `?${qs}` : ''}`);
};
export const fetchServiceBySlug = (slug) => request(`/services/${slug}`);
export const fetchCategories = () => request('/services/categories');
export const submitInquiry = (d) => request('/inquiries', { method: 'POST', body: JSON.stringify(d) });
export const submitContact = (d) => request('/contact', { method: 'POST', body: JSON.stringify(d) });
export const trackEvent = async (page, event, metadata = {}) => {
  try { await request('/analytics/track', { method: 'POST', body: JSON.stringify({ page, event, metadata }) }); } catch {}
};
export const fetchMaintenanceStatus = () => request('/maintenance/status');
export const checkHealth = () => request('/health');

// Public content
export const fetchContentProjects = () => request('/content/projects');
export const fetchContentSkills = () => request('/content/skills');
export const fetchContentExperience = () => request('/content/experience');
export const fetchContentEducation = () => request('/content/education');
export const fetchContentLeadership = () => request('/content/leadership');
export const fetchContentTestimonials = () => request('/content/testimonials');
export const fetchContentProfile = () => request('/content/profile');
export const fetchContentConfig = () => request('/content/config');

// ─── Admin Auth ──────────────────────────────────────────────────────────────
export const adminLogin = (email, password) =>
  request('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const adminRefresh = (refreshToken) =>
  request('/admin/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) });

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
export const fetchDashboard = () => request('/admin/dashboard', { auth: true });
export const fetchAdminAnalytics = (days = 30) => request(`/admin/analytics?days=${days}`, { auth: true });

// ─── Admin CRUD Factory ─────────────────────────────────────────────────────
const adminCrud = (base) => ({
  list: (q = '') => request(`${base}${q ? `?${q}` : ''}`, { auth: true }),
  get: (id) => request(`${base}/${id}`, { auth: true }),
  create: (d) => request(base, { method: 'POST', body: JSON.stringify(d), auth: true }),
  update: (id, d) => request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(d), auth: true }),
  remove: (id) => request(`${base}/${id}`, { method: 'DELETE', auth: true }),
  restore: (id) => request(`${base}/${id}/restore`, { method: 'PUT', auth: true }),
  hardDelete: (id) => request(`${base}/${id}/permanent`, { method: 'DELETE', auth: true }),
  reorder: (items) => request(`${base}/batch/reorder`, { method: 'PUT', body: JSON.stringify({ items }), auth: true }),
});

export const adminServices = adminCrud('/admin/services');
export const adminMessages = adminCrud('/admin/messages');
export const adminInquiries = adminCrud('/admin/inquiries');
export const adminProjects = adminCrud('/admin/content/projects');
export const adminSkills = adminCrud('/admin/content/skills');
export const adminExperience = adminCrud('/admin/content/experience');
export const adminEducation = adminCrud('/admin/content/education');
export const adminLeadership = adminCrud('/admin/content/leadership');
export const adminTestimonials = adminCrud('/admin/content/testimonials');

// ─── Admin Singletons ────────────────────────────────────────────────────────
export const fetchAdminProfile = () => request('/admin/content/profile', { auth: true });
export const updateAdminProfile = (d) => request('/admin/content/profile', { method: 'PUT', body: JSON.stringify(d), auth: true });
export const fetchAdminConfig = () => request('/admin/content/config', { auth: true });
export const updateAdminConfig = (d) => request('/admin/content/config', { method: 'PUT', body: JSON.stringify(d), auth: true });
export const updateAdminConfigSection = (section, d) =>
  request(`/admin/content/config/${section}`, { method: 'PUT', body: JSON.stringify({ data: d }), auth: true });

// ─── Admin Maintenance ───────────────────────────────────────────────────────
export const fetchAdminMaintenance = () => request('/admin/maintenance', { auth: true });
export const updateAdminMaintenance = (d) => request('/admin/maintenance', { method: 'PUT', body: JSON.stringify(d), auth: true });

// ─── Cloudinary Upload ───────────────────────────────────────────────────────
export const uploadImage = async (file, folder = 'portfolio') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const token = getToken();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) return { data: null, error: data.error || 'Upload failed' };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Upload failed' };
  }
};
