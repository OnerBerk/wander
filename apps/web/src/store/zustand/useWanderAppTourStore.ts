import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WanderAppTourStore {
  hasSeenWelcome: boolean;
  isDataTourDone: boolean;
  setHasSeenWelcome: () => void;
  setIsDataTourDone: () => void;
}

const useWanderAppTourStore = create<WanderAppTourStore>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      isDataTourDone: false,
      setHasSeenWelcome: () => set({ hasSeenWelcome: true }),
      setIsDataTourDone: () => set({ isDataTourDone: true }),
    }),
    {
      name: 'wander-app-tour',
      version: 3,
    },
  ),
);

export default useWanderAppTourStore;
