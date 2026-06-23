import { RefObject, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { createSpaceInvaderMarkerElement } from '@/assets/markers/invaders/invaders-marker';
import { loadSpaceInvadersData } from '@/components/map/space-invaders-geojson';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';

interface UseSpaceInvadersMarkersParams {
  map: RefObject<maplibregl.Map | null>;
  areLayersReady: boolean;
}

export const useSpaceInvadersMarkers = ({ map, areLayersReady }: UseSpaceInvadersMarkersParams): void => {
  const markers = useRef<maplibregl.Marker[]>([]);
  const isSpaceInvadersVisible = useMapLayersStore((state) => state.isSpaceInvadersVisible);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    if (!isSpaceInvadersVisible) return;

    let isCancelled = false;
    const currentMap = map.current;

    void loadSpaceInvadersData().then((spaceInvaders) => {
      if (isCancelled || !isSpaceInvadersVisible) return;

      const staggerMs = 28;
      const mapCenter = currentMap.getCenter();
      const sorted = [...spaceInvaders].sort((left, right) => {
        const leftDistance = Math.abs(left.lat - mapCenter.lat) + Math.abs(left.lng - mapCenter.lng);
        const rightDistance = Math.abs(right.lat - mapCenter.lat) + Math.abs(right.lng - mapCenter.lng);
        return leftDistance - rightDistance;
      });
      const maxDelayMs = staggerMs * Math.min(Math.max(sorted.length - 1, 0), 60);

      markers.current = sorted.map((invader, index) => {
        const delayMs = Math.min(index * staggerMs, maxDelayMs);
        const element = createSpaceInvaderMarkerElement(invader.id, delayMs);
        return new maplibregl.Marker({ element }).setLngLat([invader.lng, invader.lat]).addTo(currentMap);
      });
    });

    return () => {
      isCancelled = true;
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [areLayersReady, isSpaceInvadersVisible, map]);
};
