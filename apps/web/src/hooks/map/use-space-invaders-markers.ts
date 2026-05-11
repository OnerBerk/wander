import {RefObject, useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import {InvadersOverpassElement} from '@wander/types';
import {applyMarkerEntranceBounce} from '@/utils/map-utils';
import markerSpaceInvadersUrl from '@/assets/markers/marker-space-invaders.png';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';

const createSpaceInvaderMarkerElement = (delayMs = 0): HTMLElement => {
  const img = document.createElement('img');
  img.src = markerSpaceInvadersUrl;
  img.alt = '';
  img.className = 'h-8 w-8 object-contain md:h-10 md:w-10';
  return applyMarkerEntranceBounce(img, delayMs);
};

interface UseSpaceInvadersMarkersParams {
  map: RefObject<maplibregl.Map | null>;
  areLayersReady: boolean;
  spaceInvaders: InvadersOverpassElement[];
}

export const useSpaceInvadersMarkers = ({map, areLayersReady, spaceInvaders}: UseSpaceInvadersMarkersParams): void => {
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
      const element = createSpaceInvaderMarkerElement(delayMs);
      return new maplibregl.Marker({element}).setLngLat([invader.lon, invader.lat]).addTo(currentMap);
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [areLayersReady, isSpaceInvadersVisible, map, spaceInvaders]);
};
