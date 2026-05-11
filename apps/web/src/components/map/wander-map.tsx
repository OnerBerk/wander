import {useRef} from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import {EventData, InvadersOverpassElement, VelibStation} from '@wander/types';
import {useEventLayers} from '@/hooks/map/use-event-layers';
import {useMapInstance} from '@/hooks/map/use-map-instance';
import {useMetroLayers} from '@/hooks/map/use-metro-layers';
import {useVelibMarkers} from '@/hooks/map/use-velib-markers';
import {useSpaceInvadersMarkers} from '@/hooks/map/use-space-invaders-markers';

interface WanderMapProps {
  events: EventData[];
  velibStations: VelibStation[];
  spaceInvaders: InvadersOverpassElement[];
}

const WanderMap: React.FC<WanderMapProps> = ({events, velibStations, spaceInvaders}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const {map, areEventLayersReady} = useMapInstance(mapContainer);

  useEventLayers({map, events, areLayersReady: areEventLayersReady});
  useMetroLayers({map, areLayersReady: areEventLayersReady});
  useVelibMarkers({map, velibStations});
  useSpaceInvadersMarkers({map, areLayersReady: areEventLayersReady, spaceInvaders});
  return <div ref={mapContainer} className='h-full w-full' />;
};

export default WanderMap;
