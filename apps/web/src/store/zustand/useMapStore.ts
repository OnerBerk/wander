import {MapView} from '@wander/types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface MapStore {
  mapView: MapView;
  setMapView: (view: MapView) => void;
}

const useMapStore = create<MapStore>()(
  persist(
    (set) => ({
      mapView: {
        lat: 48.8566,
        lng: 2.3522,
        radius: 5,
      },
      setMapView: (view) => set({mapView: view}),
    }),
    {name: 'wander-map'}
  )
);

export default useMapStore;
