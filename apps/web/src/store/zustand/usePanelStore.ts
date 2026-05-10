import {create} from 'zustand';

interface PanelStore {
  isPanelOpen: boolean;
  togglePanel: () => void;
}

const usePanelStore = create<PanelStore>()((set) => ({
  isPanelOpen: false,
  togglePanel: () => set((state) => ({isPanelOpen: !state.isPanelOpen})),
}));

export default usePanelStore;
