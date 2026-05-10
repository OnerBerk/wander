import {useEvents} from '@/api/features/events/useEvents';
import {useSpaceInvaders} from '@/api/features/space-invaders/useSpaceInvaders';
import {useVelib} from '@/api/features/velib/useVelib';
import WanderMap from '@/components/map/wander-map';
import useFilterStore from '@/store/zustand/useFilterStore';

const MapPage = () => {
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);

  const {data: spaceInvaders} = useSpaceInvaders();
  const {data: velibStations} = useVelib();
  const {data: events} = useEvents();

  return (
    <div className='h-full w-full'>
      <WanderMap
        velibStations={velibStations ?? []}
        events={eventsEnabled ? (events ?? []) : []}
        spaceInvaders={spaceInvaders ?? []}
      />
    </div>
  );
};

export default MapPage;
