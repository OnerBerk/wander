import { MapView } from '@wander/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_ZOOM, PARIS_CENTER } from '@/constants/map-constants';
import { calculateRadius } from '@/utils/map-utils';

const createParisMapView = (): MapView => ({
  ...PARIS_CENTER,
  radius: calculateRadius(DEFAULT_ZOOM),
});

const syncMapViewFromGeolocation = (): void => {
  if (!('geolocation' in navigator)) return;

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      useMapStore.getState().setMapView({
        lat: coords.latitude,
        lng: coords.longitude,
        radius: calculateRadius(DEFAULT_ZOOM),
      });
    },
    () => {
      useMapStore.getState().setMapView(createParisMapView());
    },
    { enableHighAccuracy: true, timeout: 10_000 },
  );
};

interface MapStore {
  mapView: MapView;
  setMapView: (view: MapView) => void;
}

const useMapStore = create<MapStore>()(
  persist(
    (set) => ({
      mapView: createParisMapView(),
      setMapView: (view) => set({ mapView: view }),
    }),
    {
      name: 'wander-map',
      onRehydrateStorage: () => () => {
        syncMapViewFromGeolocation();
      },
    },
  ),
);

export default useMapStore;
