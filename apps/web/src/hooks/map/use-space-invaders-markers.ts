import { RefObject, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { InvadersOverpassElement } from '@wander/types';
import { createSpaceInvaderMarkerElement } from '@/assets/markers/invaders/invaders-marker';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';

interface UseSpaceInvadersMarkersParams {
  map: RefObject<maplibregl.Map | null>;
  areLayersReady: boolean;
  spaceInvaders: InvadersOverpassElement[];
}

export const useSpaceInvadersMarkers = ({
  map,
  areLayersReady,
  spaceInvaders,
}: UseSpaceInvadersMarkersParams): void => {
  const markers = useRef<maplibregl.Marker[]>([]);
  const isSpaceInvadersVisible = useMapLayersStore((state) => state.isSpaceInvadersVisible);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    if (!isSpaceInvadersVisible) return;

    const currentMap = map.current;
    const validInvaders = spaceInvaders.filter((invader) => invader.lat != null && invader.lon != null);

    const staggerMs = 28;
    const mapCenter = currentMap.getCenter();
    const sorted = [...validInvaders].sort((left, right) => {
      const leftDistance = Math.abs(left.lat - mapCenter.lat) + Math.abs(left.lon - mapCenter.lng);
      const rightDistance = Math.abs(right.lat - mapCenter.lat) + Math.abs(right.lon - mapCenter.lng);
      return leftDistance - rightDistance;
    });
    const maxDelayMs = staggerMs * Math.min(Math.max(sorted.length - 1, 0), 60);

    markers.current = sorted.map((invader, index) => {
      const delayMs = Math.min(index * staggerMs, maxDelayMs);
      const element = createSpaceInvaderMarkerElement(invader.id, delayMs);
      return new maplibregl.Marker({ element }).setLngLat([invader.lon, invader.lat]).addTo(currentMap);
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [areLayersReady, isSpaceInvadersVisible, map, spaceInvaders]);
};
