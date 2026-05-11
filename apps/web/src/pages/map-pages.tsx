import {useMemo} from 'react';
import {useEvents} from '@/api/features/events/useEvents';
import {useSpaceInvaders} from '@/api/features/space-invaders/useSpaceInvaders';
import {useVelib} from '@/api/features/velib/useVelib';
import WanderMap from '@/components/map/wander-map';
import useFilterStore from '@/store/zustand/useFilterStore';
import useEventsMapStore, {sortAccumulatedEventsById} from '@/store/zustand/useEventsMapStore';

const MapPage = () => {
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);
  const eventsById = useEventsMapStore((state) => state.eventsById);
  const accumulatedEvents = useMemo(() => sortAccumulatedEventsById(eventsById), [eventsById]);

  const {data: spaceInvaders} = useSpaceInvaders();
  const {data: velibStations} = useVelib();
  useEvents();

  return (
    <div className='h-full w-full'>
      <WanderMap
        velibStations={velibStations ?? []}
        events={eventsEnabled ? accumulatedEvents : []}
        spaceInvaders={spaceInvaders ?? []}
      />
    </div>
  );
};

export default MapPage;
