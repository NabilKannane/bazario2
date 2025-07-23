import { create } from 'zustand';

interface UIState {
  // Modals
  authModalOpen: boolean;
  cartModalOpen: boolean;
  searchModalOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>;

  // Actions
  setAuthModalOpen: (open: boolean) => void;
  setCartModalOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  authModalOpen: false,
  cartModalOpen: false,
  searchModalOpen: false,
  globalLoading: false,
  notifications: [],

  // Actions
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  setCartModalOpen: (open) => set({ cartModalOpen: open }),
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
}));