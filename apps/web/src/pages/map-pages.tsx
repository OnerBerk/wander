import {useEvents} from '@/api/features/events/useEvents';
import WanderMap from '@/components/map/wander-map';

const MapPage = () => {
  const {data: events} = useEvents();
  console.log(events?.map((e) => e.tags));

  return (
    <div className='h-full w-full'>
      <WanderMap events={events ?? []} />
    </div>
  );
};

export default MapPage;
