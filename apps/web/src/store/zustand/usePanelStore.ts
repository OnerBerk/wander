import {create} from 'zustand';

interface PanelStore {
  isPanelOpen: boolean;
  isWeatherPanelOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  toggleWeatherPanel: () => void;
  closeWeatherPanel: () => void;
}

const usePanelStore = create<PanelStore>()((set) => ({
  isPanelOpen: false,
  isWeatherPanelOpen: false,
  togglePanel: () => set((state) => ({isPanelOpen: !state.isPanelOpen})),
  closePanel: () => set({isPanelOpen: false}),
  toggleWeatherPanel: () => set((state) => ({isWeatherPanelOpen: !state.isWeatherPanelOpen})),
  closeWeatherPanel: () => set({isWeatherPanelOpen: false}),
}));

export default usePanelStore;
