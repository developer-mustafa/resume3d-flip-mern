import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useToastStore from '../../stores/toastStore';
import {
  LayoutDashboard, User, Wrench, Briefcase, FolderKanban,
  GraduationCap, Award, Handshake, Link2, MessageSquare,
  BookOpen, Search, Image, Users, Activity, Settings,
  LogOut, Menu, X, ChevronLeft, Mail, KeyRound
} from 'lucide-react';

const navItems = [
  { path: '', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: 'profile', icon: User, label: 'Profile' },
  { path: 'skills', icon: Wrench, label: 'Skills' },
  { path: 'experience', icon: Briefcase, label: 'Experience' },
  { path: 'projects', icon: FolderKanban, label: 'Projects' },
  { path: 'education', icon: GraduationCap, label: 'Education' },
  { path: 'certifications', icon: Award, label: 'Certifications' },
  { path: 'services', icon: Handshake, label: 'Services' },
  { path: 'social-links', icon: Link2, label: 'Social Links' },
  { path: 'contact', icon: MessageSquare, label: 'Contact' },
  { path: 'email-settings', icon: Mail, label: 'Email & SMTP' },
  { path: 'book-settings', icon: BookOpen, label: 'Book Settings' },
  { path: 'seo', icon: Search, label: 'SEO' },
  { path: 'media', icon: Image, label: 'Media' },
  { path: 'admin-users', icon: Users, label: 'Admin Users' },
  { path: 'activity-logs', icon: Activity, label: 'Activity Logs' },
];

import ChangePasswordModal from './ChangePasswordModal';

export default function AdminLayout() {
  const { admin, logout } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-charcoal flex">
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed lg:sticky top-0 left-0 z-50 w-60 h-screen bg-charcoal-light border-r border-border-dark flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border-dark flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-ivory hover:text-accent transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-medium">Resume Book</span>
          </a>
          <button
            className="lg:hidden text-muted-light hover:text-ivory"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/admin/dashboard/${item.path}`}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-muted-light hover:text-ivory hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-border-dark">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-semibold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ivory truncate">{admin?.name}</p>
              <p className="text-[10px] text-muted-light truncate">{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-light hover:text-white rounded-lg hover:bg-white/5 transition-colors mb-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-light hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="admin-topbar sticky top-0 z-30 h-14 bg-charcoal-light/80 backdrop-blur-md border-b border-border-dark flex items-center px-4 lg:px-6">
          <button
            className="lg:hidden mr-3 text-muted-light hover:text-ivory"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-ivory">Admin Dashboard</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
