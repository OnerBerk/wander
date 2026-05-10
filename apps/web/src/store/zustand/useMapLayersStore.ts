import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface MapLayersStore {
  isVelibMarkersVisible: boolean;
  isMetroMarkersVisible: boolean;
  isSpaceInvadersVisible: boolean;
  toggleVelibMarkers: () => void;
  toggleMetroMarkers: () => void;
  toggleSpaceInvaders: () => void;
}

const useMapLayersStore = create<MapLayersStore>()(
  persist(
    (set) => ({
      isVelibMarkersVisible: false,
      isMetroMarkersVisible: false,
      isSpaceInvadersVisible: false,
      toggleVelibMarkers: () =>
        set((state) => ({isVelibMarkersVisible: !state.isVelibMarkersVisible})),
      toggleMetroMarkers: () =>
        set((state) => ({isMetroMarkersVisible: !state.isMetroMarkersVisible})),
      toggleSpaceInvaders: () =>
        set((state) => ({isSpaceInvadersVisible: !state.isSpaceInvadersVisible})),
    }),
    {
      name: 'wander-map-layers',
      version: 3,
      migrate: (persistedState, version) => {
        if (version < 3 && persistedState && typeof persistedState === 'object') {
          return {
            ...(persistedState as MapLayersStore),
            isVelibMarkersVisible: false,
            isMetroMarkersVisible: false,
            isSpaceInvadersVisible: false,
          };
        }
        return persistedState as MapLayersStore;
      },
    }
  )
);

export default useMapLayersStore;
