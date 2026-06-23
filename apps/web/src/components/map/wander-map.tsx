import {useRef} from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import {EventData, VelibStation} from '@wander/types';
import {useEventLayers} from '@/hooks/map/use-event-layers';
import {useMapInstance} from '@/hooks/map/use-map-instance';
import {useMetroLayers} from '@/hooks/map/use-metro-layers';
import {useVelibMarkers} from '@/hooks/map/use-velib-markers';
import {useSpaceInvadersMarkers} from '@/hooks/map/use-space-invaders-markers';

interface WanderMapProps {
  events: EventData[];
  velibStations: VelibStation[];
}

const WanderMap: React.FC<WanderMapProps> = ({events, velibStations}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const {map, areEventLayersReady} = useMapInstance(mapContainer);

  useEventLayers({map, events, areLayersReady: areEventLayersReady});
  useMetroLayers({map, areLayersReady: areEventLayersReady});
  useVelibMarkers({map, velibStations});
  useSpaceInvadersMarkers({map, areLayersReady: areEventLayersReady});
  return <div ref={mapContainer} className='wander-map h-full w-full' />;
};

export default WanderMap;
