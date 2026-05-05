import maplibregl from 'maplibre-gl';
import subwayMarkerImageUrl from '@/assets/markers/subway/marker-subway.png';
import type {MetroGeoJsonFeatureCollection} from '@/components/map/metro-geojson';
import {applyMarkerEntranceBounce} from '@/utils/map-utils';
import {
  MAP_MOBILE_BREAKPOINT_PX,
  METRO_MARKER_ICON_SIZE_DESKTOP,
  METRO_MARKER_ICON_SIZE_MOBILE,
  METRO_MARKER_IMAGE_ID,
  METRO_MARKER_PIXEL_RATIO,
  METRO_STATIONS_LAYER_ID,
  METRO_STATIONS_SOURCE_ID,
} from '@/constants/map-constants';

const EMPTY_GEOJSON: MetroGeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const loadImageElement = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load map marker image: ${src}`));
    image.src = src;
  });
};

export const addMetroMarkerImage = async (targetMap: maplibregl.Map): Promise<void> => {
  const image = await loadImageElement(subwayMarkerImageUrl);

  if (targetMap.hasImage(METRO_MARKER_IMAGE_ID)) {
    targetMap.removeImage(METRO_MARKER_IMAGE_ID);
  }

  targetMap.addImage(METRO_MARKER_IMAGE_ID, image, {pixelRatio: METRO_MARKER_PIXEL_RATIO});
};

export const addMetroLayers = (targetMap: maplibregl.Map): void => {
  if (!targetMap.getSource(METRO_STATIONS_SOURCE_ID)) {
    targetMap.addSource(METRO_STATIONS_SOURCE_ID, {
      type: 'geojson',
      data: EMPTY_GEOJSON,
    });
  }

  if (!targetMap.getLayer(METRO_STATIONS_LAYER_ID)) {
    targetMap.addLayer({
      id: METRO_STATIONS_LAYER_ID,
      type: 'symbol',
      source: METRO_STATIONS_SOURCE_ID,
      layout: {
        'icon-image': METRO_MARKER_IMAGE_ID,
        'icon-size': METRO_MARKER_ICON_SIZE_DESKTOP,
        'icon-allow-overlap': true,
        'icon-anchor': 'center',
      },
    });
  }
};

export const getMetroMarkerIconSize = (viewportWidth: number): number => {
  return viewportWidth < MAP_MOBILE_BREAKPOINT_PX
    ? METRO_MARKER_ICON_SIZE_MOBILE
    : METRO_MARKER_ICON_SIZE_DESKTOP;
};

export const syncMetroMarkerIconSize = (targetMap: maplibregl.Map, viewportWidth: number): void => {
  if (!targetMap.getLayer(METRO_STATIONS_LAYER_ID)) return;

  targetMap.setLayoutProperty(METRO_STATIONS_LAYER_ID, 'icon-size', getMetroMarkerIconSize(viewportWidth));
};

export const createMetroMarkerElement = (delayMs = 0): HTMLElement => {
  const image = document.createElement('img');
  image.src = subwayMarkerImageUrl;
  image.alt = '';
  image.className = 'h-7 w-7 object-contain md:h-9 md:w-9';

  const marker = applyMarkerEntranceBounce(image, delayMs);
  marker.classList.add('cursor-pointer');
  return marker;
};
