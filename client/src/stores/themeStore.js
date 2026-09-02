import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      mode: 'light', // 'light' | 'dark'
      theme: 'amber', // 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'cyan' | 'indigo'
      setMode: (mode) => set({ mode }),
      setTheme: (theme) => set({ theme }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'resume3d-theme-storage',
    }
  )
);

export default useThemeStore;
