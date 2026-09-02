import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './stores/authStore';
import BookPage from './components/book/BookPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardHome from './components/admin/DashboardHome';
import ProfileManager from './components/admin/ProfileManager';
import SkillsManager from './components/admin/SkillsManager';
import ExperienceManager from './components/admin/ExperienceManager';
import ProjectsManager from './components/admin/ProjectsManager';
import EducationManager from './components/admin/EducationManager';
import CertificationsManager from './components/admin/CertificationsManager';
import ServicesManager from './components/admin/ServicesManager';
import SocialLinksManager from './components/admin/SocialLinksManager';
import ContactManager from './components/admin/ContactManager';
import EmailSettingsManager from './components/admin/EmailSettingsManager';
import BookSettingsManager from './components/admin/BookSettingsManager';
import SEOManager from './components/admin/SEOManager';
import MediaManager from './components/admin/MediaManager';
import AdminUsersManager from './components/admin/AdminUsersManager';
import ActivityLogs from './components/admin/ActivityLogs';
import Toast from './components/ui/Toast';

import ForgotPassword from './components/admin/ForgotPassword';
import ResetPassword from './components/admin/ResetPassword';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<BookPage />} />
        <Route path="/resume" element={<BookPage initialPage={1} />} />
        <Route path="/projects" element={<BookPage initialPage={3} />} />
        <Route path="/contact" element={<BookPage initialPage={4} />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfileManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="education" element={<EducationManager />} />
          <Route path="certifications" element={<CertificationsManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="social-links" element={<SocialLinksManager />} />
          <Route path="contact" element={<ContactManager />} />
          <Route path="email-settings" element={<EmailSettingsManager />} />
          <Route path="book-settings" element={<BookSettingsManager />} />
          <Route path="seo" element={<SEOManager />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="admin-users" element={<AdminUsersManager />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
        </Route>

        {/* Redirect /admin to /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
