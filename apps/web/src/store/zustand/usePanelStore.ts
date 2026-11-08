import {create} from 'zustand';

interface PanelStore {
  isPanelOpen: boolean;
  isWeatherPanelOpen: boolean;
  isAiPanelOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  toggleWeatherPanel: () => void;
  closeWeatherPanel: () => void;
  toggleAiPanel: () => void;
  closeAiPanel: () => void;
}

const usePanelStore = create<PanelStore>()((set) => ({
  isPanelOpen: false,
  isWeatherPanelOpen: false,
  isAiPanelOpen: false,
  togglePanel: () => set((state) => ({isPanelOpen: !state.isPanelOpen})),
  closePanel: () => set({isPanelOpen: false}),
  toggleWeatherPanel: () => set((state) => ({isWeatherPanelOpen: !state.isWeatherPanelOpen})),
  closeWeatherPanel: () => set({isWeatherPanelOpen: false}),
  toggleAiPanel: () => set((state) => ({isAiPanelOpen: !state.isAiPanelOpen})),
  closeAiPanel: () => set({isAiPanelOpen: false}),
}));

export default usePanelStore;
