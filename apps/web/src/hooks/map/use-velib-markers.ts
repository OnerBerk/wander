import { RefObject, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { VelibStation } from '@wander/types';
import { getVelibMarkerElement } from '@/utils/map-utils';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface UseVelibMarkersParams {
  map: RefObject<maplibregl.Map | null>;
  velibStations: VelibStation[];
}

export const useVelibMarkers = ({ map, velibStations }: UseVelibMarkersParams): void => {
  const velibMarkers = useRef<maplibregl.Marker[]>([]);
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);
  const openBikeDetail = useMarkerStore((state) => state.openBikeDetail);

  useEffect(() => {
    if (!map.current) return;
    velibMarkers.current.forEach((marker) => marker.remove());

    if (!isVelibMarkersVisible) {
      velibMarkers.current = [];
      return;
    }

    const staggerMs = 28;
    const mapCenter = map.current.getCenter();
    const sortedStations = [...velibStations].sort((left, right) => {
      const leftDistance = Math.abs(left.location.lat - mapCenter.lat) + Math.abs(left.location.lng - mapCenter.lng);
      const rightDistance = Math.abs(right.location.lat - mapCenter.lat) + Math.abs(right.location.lng - mapCenter.lng);
      return leftDistance - rightDistance;
    });
    const maxDelayMs = staggerMs * Math.min(Math.max(sortedStations.length - 1, 0), 60);

    velibMarkers.current = sortedStations.map((station, index) => {
      const delayMs = Math.min(index * staggerMs, maxDelayMs);
      const element = getVelibMarkerElement(station.bikesAvailable, delayMs);

      element.addEventListener('click', (markerEvent) => {
        markerEvent.stopPropagation();
        openBikeDetail(station);
      });

      return new maplibregl.Marker({ element })
        .setLngLat([station.location.lng, station.location.lat])
        .addTo(map.current!);
    });
  }, [isVelibMarkersVisible, map, openBikeDetail, velibStations]);
};
