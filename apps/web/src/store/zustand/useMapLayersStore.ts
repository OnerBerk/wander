import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface MapLayersStore {
  isVelibMarkersVisible: boolean;
  isMetroMarkersVisible: boolean;
  toggleVelibMarkers: () => void;
  toggleMetroMarkers: () => void;
}

const useMapLayersStore = create<MapLayersStore>()(
  persist(
    (set) => ({
      isVelibMarkersVisible: false,
      isMetroMarkersVisible: false,
      toggleVelibMarkers: () =>
        set((state) => ({isVelibMarkersVisible: !state.isVelibMarkersVisible})),
      toggleMetroMarkers: () =>
        set((state) => ({isMetroMarkersVisible: !state.isMetroMarkersVisible})),
    }),
    {
      name: 'wander-map-layers',
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState && typeof persistedState === 'object') {
          return {
            ...(persistedState as MapLayersStore),
            isVelibMarkersVisible: false,
            isMetroMarkersVisible: false,
          };
        }
        return persistedState as MapLayersStore;
      },
    }
  )
);

export default useMapLayersStore;
