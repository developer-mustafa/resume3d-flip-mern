import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 4000,
      ...toast,
    };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  success: (message) => get().addToast({ message, type: 'success' }),
  error: (message) => get().addToast({ message, type: 'error', duration: 6000 }),
  warning: (message) => get().addToast({ message, type: 'warning' }),
  info: (message) => get().addToast({ message, type: 'info' }),
}));

export default useToastStore;
