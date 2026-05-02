import {useRef} from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import {EventData, VelibStation} from '@wander/types';
import {useEventLayers} from '@/hooks/map-hooks/use-event-layers';
import {useMapInstance} from '@/hooks/map-hooks/use-map-instance';
import {useVelibMarkers} from '@/hooks/map-hooks/use-velib-markers';

interface WanderMapProps {
  events: EventData[];
  velibStations: VelibStation[];
}

const WanderMap: React.FC<WanderMapProps> = ({events, velibStations}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const {map, areEventLayersReady} = useMapInstance(mapContainer);

  useEventLayers({map, events, areLayersReady: areEventLayersReady});
  useVelibMarkers({map, velibStations});

  return <div ref={mapContainer} className='h-full w-full' />;
};

export default WanderMap;
