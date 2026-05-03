import maplibregl from 'maplibre-gl';
import defaultMarkerImageUrl from '@/assets/markers/marker-default.png';
import musicMarkerImageUrl from '@/assets/markers/music-marker.png';
import treeMarkerImageUrl from '@/assets/markers/marker-tree.png';
import bookMarkerImageUrl from '@/assets/markers/marker-book.png';
import {
  EVENT_CLUSTER_COUNT_LAYER_ID,
  EVENT_CLUSTER_RADIUS,
  EVENT_CLUSTERS_LAYER_ID,
  EVENT_MARKER_ICON_SIZE_DESKTOP,
  EVENT_MARKER_ICON_SIZE_MOBILE,
  EVENT_MARKER_PIXEL_RATIO,
  EVENT_POINTS_LAYER_ID,
  EVENTS_SOURCE_ID,
  MAP_MOBILE_BREAKPOINT_PX,
} from '@/constants/map-constants';
import {buildEventsGeoJson, EVENT_MARKER_IMAGE_IDS} from '@/components/map/events-geojson';

export type LayerClickEvent = maplibregl.MapMouseEvent & {
  features?: Array<{
    properties?: Record<string, unknown>;
  }>;
};

const loadImageElement = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load map marker image: ${src}`));
    image.src = src;
  });
};

export const addEventMarkerImages = async (targetMap: maplibregl.Map): Promise<void> => {
  const markerImages = [
    {id: EVENT_MARKER_IMAGE_IDS.default, src: defaultMarkerImageUrl},
    {id: EVENT_MARKER_IMAGE_IDS.music, src: musicMarkerImageUrl},
    {id: EVENT_MARKER_IMAGE_IDS.tree, src: treeMarkerImageUrl},
    {id: EVENT_MARKER_IMAGE_IDS.book, src: bookMarkerImageUrl},
  ];

  await Promise.all(
    markerImages.map(async ({id, src}) => {
      const image = await loadImageElement(src);

      if (targetMap.hasImage(id)) {
        targetMap.removeImage(id);
      }

      targetMap.addImage(id, image, {pixelRatio: EVENT_MARKER_PIXEL_RATIO});
    })
  );
};

export const addEventLayers = (targetMap: maplibregl.Map): void => {
  if (!targetMap.getSource(EVENTS_SOURCE_ID)) {
    targetMap.addSource(EVENTS_SOURCE_ID, {
      type: 'geojson',
      data: buildEventsGeoJson([]),
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: EVENT_CLUSTER_RADIUS,
    });
  }

  if (!targetMap.getLayer(EVENT_CLUSTERS_LAYER_ID)) {
    targetMap.addLayer({
      id: EVENT_CLUSTERS_LAYER_ID,
      type: 'circle',
      source: EVENTS_SOURCE_ID,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#f97316',
        'circle-radius': ['step', ['get', 'point_count'], 18, 10, 22, 30, 28],
        'circle-opacity': 0.9,
      },
    });
  }

  if (!targetMap.getLayer(EVENT_CLUSTER_COUNT_LAYER_ID)) {
    targetMap.addLayer({
      id: EVENT_CLUSTER_COUNT_LAYER_ID,
      type: 'symbol',
      source: EVENTS_SOURCE_ID,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-size': 12,
      },
      paint: {
        'text-color': '#ffffff',
      },
    });
  }

  if (!targetMap.getLayer(EVENT_POINTS_LAYER_ID)) {
    targetMap.addLayer({
      id: EVENT_POINTS_LAYER_ID,
      type: 'symbol',
      source: EVENTS_SOURCE_ID,
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['get', 'markerIcon'],
        'icon-size': EVENT_MARKER_ICON_SIZE_DESKTOP,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
    });
  }
};

export const getEventMarkerIconSize = (viewportWidth: number): number => {
  return viewportWidth < MAP_MOBILE_BREAKPOINT_PX ? EVENT_MARKER_ICON_SIZE_MOBILE : EVENT_MARKER_ICON_SIZE_DESKTOP;
};

export const syncEventMarkerIconSize = (targetMap: maplibregl.Map, viewportWidth: number): void => {
  if (!targetMap.getLayer(EVENT_POINTS_LAYER_ID)) return;

  targetMap.setLayoutProperty(EVENT_POINTS_LAYER_ID, 'icon-size', getEventMarkerIconSize(viewportWidth));
};
