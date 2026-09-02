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
import ThemeSwitcher from '../ui/ThemeSwitcher';

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
    <div className="min-h-screen bg-charcoal dark:bg-slate-900 flex">
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
        className={`admin-sidebar fixed lg:sticky top-0 left-0 z-50 w-60 h-screen bg-charcoal-light dark:bg-slate-800 border-r border-border-dark dark:border-slate-700 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border-dark dark:border-slate-700 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-ivory dark:text-slate-200 hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-medium">Resume Book</span>
          </a>
          <button
            className="lg:hidden text-muted-light dark:text-slate-400 hover:text-ivory dark:hover:text-slate-200"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/admin/dashboard/${item.path}`}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-light dark:text-slate-400 hover:text-ivory dark:hover:text-slate-200 hover:bg-white/5 dark:hover:bg-slate-700/50'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-border-dark dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ivory dark:text-slate-200 truncate">{admin?.name}</p>
              <p className="text-[10px] text-muted-light dark:text-slate-400 truncate">{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-light dark:text-slate-400 hover:text-white dark:hover:text-slate-200 rounded-lg hover:bg-white/5 dark:hover:bg-slate-700/50 transition-colors mb-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-light dark:text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="admin-topbar sticky top-0 z-30 h-14 bg-charcoal-light/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border-dark dark:border-slate-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-3 text-muted-light dark:text-slate-400 hover:text-ivory dark:hover:text-slate-200"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-ivory dark:text-slate-200">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
