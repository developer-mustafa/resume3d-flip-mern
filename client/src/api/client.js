import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    const status = error.response?.status;

    // Redirect to login on 401 (if on admin pages)
    if (status === 401 && window.location.pathname.startsWith('/admin')) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject({ message, status, details: error.response?.data?.details });
  }
);

export default api;

// ── Public API ─────────────────────────────────────────────
export const publicAPI = {
  getProfile: () => api.get('/profile'),
  getSkills: () => api.get('/skills'),
  getExperience: () => api.get('/experience'),
  getProjects: () => api.get('/projects'),
  getEducation: () => api.get('/education'),
  getCertifications: () => api.get('/certifications'),
  getServices: () => api.get('/services'),
  getSocialLinks: () => api.get('/social-links'),
  getSettings: () => api.get('/settings'),
  getSEO: () => api.get('/seo'),
  submitContact: (data) => api.post('/contact', data),
};

// ── Auth API ───────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ── Admin API ──────────────────────────────────────────────
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Profile
  updateProfile: (data) => api.put('/profile', data),

  // Skills
  getSkills: (params) => api.get('/skills/admin', { params }),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),

  // Experience
  getExperience: (params) => api.get('/experience/admin', { params }),
  createExperience: (data) => api.post('/experience', data),
  updateExperience: (id, data) => api.put(`/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/experience/${id}`),

  // Projects
  getProjects: (params) => api.get('/projects/admin', { params }),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  duplicateProject: (id) => api.post(`/projects/${id}/duplicate`),

  // Education
  getEducation: (params) => api.get('/education/admin', { params }),
  createEducation: (data) => api.post('/education', data),
  updateEducation: (id, data) => api.put(`/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/education/${id}`),

  // Certifications
  getCertifications: (params) => api.get('/certifications/admin', { params }),
  createCertification: (data) => api.post('/certifications', data),
  updateCertification: (id, data) => api.put(`/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/certifications/${id}`),

  // Services
  getServices: (params) => api.get('/services/admin', { params }),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Social Links
  getSocialLinks: (params) => api.get('/social-links/admin', { params }),
  createSocialLink: (data) => api.post('/social-links', data),
  updateSocialLink: (id, data) => api.put(`/social-links/${id}`, data),
  deleteSocialLink: (id) => api.delete(`/social-links/${id}`),

  // Contact Messages
  getMessages: (params) => api.get('/contact', { params }),
  updateMessageStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
  deleteMessage: (id) => api.delete(`/contact/${id}`),

  // Settings
  updateSettings: (data) => api.put('/settings', data),

  // SEO
  updateSEO: (data) => api.put('/seo', data),

  // Media
  getMedia: () => api.get('/media'),
  uploadMedia: (formData) => api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteMedia: (filename) => api.delete(`/media/${filename}`),

  // Admin Users
  getAdminUsers: () => api.get('/admin/users'),
  createAdminUser: (data) => api.post('/admin/users', data),
  updateAdminUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteAdminUser: (id) => api.delete(`/admin/users/${id}`),

  // Activity Logs
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
};
