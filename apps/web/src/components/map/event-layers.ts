import maplibregl from 'maplibre-gl';
import defaultMarkerImageUrl from '@/assets/markers/default/marker-default.png';
import musicMarkerImageUrl from '@/assets/markers/music/music-marker.png';
import treeMarkerImageUrl from '@/assets/markers/tree/marker-tree.png';
import {
  EVENT_CLUSTER_COUNT_LAYER_ID,
  EVENT_CLUSTERS_LAYER_ID,
  EVENT_MARKER_ICON_SIZE,
  EVENT_MARKER_PIXEL_RATIO,
  EVENT_POINTS_LAYER_ID,
  EVENTS_SOURCE_ID,
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
      clusterRadius: 50,
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
        'icon-size': EVENT_MARKER_ICON_SIZE,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
    });
  } else {
    targetMap.setLayoutProperty(EVENT_POINTS_LAYER_ID, 'icon-size', EVENT_MARKER_ICON_SIZE);
  }
};
