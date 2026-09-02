import { create } from 'zustand';
import { authAPI } from '../api/client.js';

const useAuthStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    set({ admin: data.admin, isAuthenticated: true });
    return data;
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Continue even if logout request fails
    }
    set({ admin: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ admin: data.admin, isAuthenticated: true, isLoading: false });
    } catch {
      set({ admin: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
