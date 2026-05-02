import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface MapLayersStore {
  isVelibMarkersVisible: boolean;
  toggleVelibMarkers: () => void;
}

const useMapLayersStore = create<MapLayersStore>()(
  persist(
    (set) => ({
      isVelibMarkersVisible: true,
      toggleVelibMarkers: () =>
        set((state) => ({isVelibMarkersVisible: !state.isVelibMarkersVisible})),
    }),
    {name: 'wander-map-layers'}
  )
);

export default useMapLayersStore;
