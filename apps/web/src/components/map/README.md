# Map Architecture

This map is rendered with MapLibre. `WanderMap` should stay small: it owns the DOM container and wires the map hooks together.

```tsx
const {map, areEventLayersReady} = useMapInstance(mapContainer);

useEventLayers({map, events, areLayersReady: areEventLayersReady});
useVelibMarkers({map, velibStations});
```

## Responsibilities

`useMapInstance` creates the MapLibre instance, adds the navigation control, updates the shared map viewport on `moveend`, closes the detail modal when the user clicks on empty map space, and initializes event layers after the map style has loaded.

`useEventLayers` updates the GeoJSON source when events change. It also handles clicks on event points and clusters:

- point click: reads `eventId` from the feature properties and opens the event detail modal;
- cluster click: asks MapLibre for the expansion zoom and zooms into the cluster.

`useVelibMarkers` still uses HTML `maplibregl.Marker` instances because Vélib markers include a DOM badge for the number of available bikes. This is intentionally separate from event rendering.

## Events Rendering

Events are rendered as a GeoJSON source plus MapLibre layers:

```ts
map.addSource('events', {
  type: 'geojson',
  data: buildEventsGeoJson(events),
  cluster: true,
});
```

There are three event layers:

- `event-clusters`: orange circles for clustered points;
- `event-cluster-count`: text count inside clusters;
- `event-points`: custom marker icons for individual events.

The marker icon is selected in `events-geojson.ts` and stored in each feature:

```ts
properties: {
  eventId: event.id,
  markerIcon: 'event-marker-music',
}
```

MapLibre then reads that property in the symbol layer:

```ts
'icon-image': ['get', 'markerIcon']
```

## Adding A New Event Marker

1. Add the image under `assets/markers/<name>/`.
2. Add a new image id in `events-geojson.ts`.
3. Add the image import and registration in `event-layers.ts`.
4. Update `getEventMarkerImageId()` to map tags to the new marker id.

## Important Notes

GeoJSON layers are preferred for large event datasets because they avoid creating one DOM node per event. Vélib can be migrated later to GeoJSON too, but the badge would need to become a MapLibre text layer instead of HTML.
