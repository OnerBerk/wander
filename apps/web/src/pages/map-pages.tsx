import { useEvents } from '@/api/features/events/useEvents';
import { useSpaceInvaders } from '@/api/features/space-invaders/useSpaceInvaders';
import { useVelib } from '@/api/features/velib/useVelib';
import WanderMap from '@/components/map/wander-map';
import SeoMetadata from '@/components/seo/seo-metadata';
import WanderWelcomeOverlay from '@/components/wander-app-tour/wander-welcome-overlay';
import useFilterStore from '@/store/zustand/useFilterStore';

const MapPage = () => {
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);
  const { data: events } = useEvents();
  const { data: spaceInvaders } = useSpaceInvaders();
  const { data: velibStations } = useVelib();

  return (
    <div className="relative h-full w-full">
      <h1 className="sr-only">Wander - carte interactive de Paris</h1>
      <SeoMetadata
        title="Wander | Interactive Paris Map"
        description="Explore Paris with an interactive map powered by real-time public data, live mobility, weather, events, and AI-assisted itinerary ideas."
      />
      <WanderMap
        velibStations={velibStations ?? []}
        events={eventsEnabled ? (events ?? []) : []}
        spaceInvaders={spaceInvaders ?? []}
      />
      <WanderWelcomeOverlay />
    </div>
  );
};

export default MapPage;
