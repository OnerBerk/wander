import {RefObject, useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import {loadMetroStationsData} from '@/components/map/metro-geojson';
import {createMetroMarkerElement} from '@/components/map/metro-layers';
import {METRO_STATIONS_LAYER_ID, METRO_STATIONS_SOURCE_ID} from '@/constants/map-constants';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface UseMetroLayersParams {
  map: RefObject<maplibregl.Map | null>;
  areLayersReady: boolean;
}

export const useMetroLayers = ({map, areLayersReady}: UseMetroLayersParams): void => {
  const openMetroDetail = useMarkerStore((state) => state.openMetroDetail);
  const isMetroMarkersVisible = useMapLayersStore((state) => state.isMetroMarkersVisible);
  const metroMarkersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;
    metroMarkersRef.current.forEach((marker) => marker.remove());
    metroMarkersRef.current = [];
    if (!isMetroMarkersVisible) return;

    let isCancelled = false;
    const currentMap = map.current;

    void loadMetroStationsData().then(({geoJson, stationsById}) => {
      if (isCancelled) return;

      const metroSource = currentMap.getSource(METRO_STATIONS_SOURCE_ID) as
        | maplibregl.GeoJSONSource
        | undefined;
      metroSource?.setData(geoJson);
      if (!isMetroMarkersVisible) return;

      const mapCenter = currentMap.getCenter();
      const stations = Array.from(stationsById.values()).sort((left, right) => {
        const leftDistance =
          Math.abs(left.coordinates[1] - mapCenter.lat) + Math.abs(left.coordinates[0] - mapCenter.lng);
        const rightDistance =
          Math.abs(right.coordinates[1] - mapCenter.lat) + Math.abs(right.coordinates[0] - mapCenter.lng);
        return leftDistance - rightDistance;
      });
      const staggerMs = 28;
      const maxDelayMs = staggerMs * Math.min(Math.max(stations.length - 1, 0), 60);

      metroMarkersRef.current = stations.map((station, index) => {
        const delayMs = Math.min(index * staggerMs, maxDelayMs);
        const element = createMetroMarkerElement(delayMs);
        element.addEventListener('click', (markerEvent) => {
          markerEvent.stopPropagation();
          openMetroDetail(station);
        });

        return new maplibregl.Marker({element}).setLngLat(station.coordinates).addTo(currentMap);
      });
    });

    return () => {
      isCancelled = true;
      metroMarkersRef.current.forEach((marker) => marker.remove());
      metroMarkersRef.current = [];
    };
  }, [areLayersReady, isMetroMarkersVisible, map, openMetroDetail]);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;
    if (!map.current.getLayer(METRO_STATIONS_LAYER_ID)) return;

    map.current.setLayoutProperty(METRO_STATIONS_LAYER_ID, 'visibility', 'none');
  }, [areLayersReady, isMetroMarkersVisible, map]);
};
