import {useEvents} from '@/api/features/events/useEvents';
import {useVelib} from '@/api/features/velib/useVelib';
import WanderMap from '@/components/map/wander-map';

const MapPage = () => {
  const {data: events} = useEvents();
  const {data: velibStations} = useVelib();

  return (
    <div className='h-full w-full'>
      <WanderMap velibStations={velibStations ?? []} events={events ?? []} />
    </div>
  );
};

export default MapPage;
