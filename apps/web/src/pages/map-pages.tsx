import { useEvents } from '@/api/features/events/useEvents';
import { useVelib } from '@/api/features/velib/useVelib';
import WanderMap from '@/components/map/wander-map';
import SeoMetadata from '@/components/seo/seo-metadata';
import useFilterStore from '@/store/zustand/useFilterStore';

const MapPage = () => {
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);
  const { data: events } = useEvents();
  const { data: velibStations } = useVelib();

  return (
    <div className="relative h-full w-full">
      <h1 className="sr-only">Wander — carte interactive de Paris</h1>
      <SeoMetadata
        title="Wander | Carte interactive de Paris"
        description="Explorez Paris sur une carte interactive : événements, Vélib, métro et météo en temps réel."
        canonicalPath="/map"
      />
      <WanderMap velibStations={velibStations ?? []} events={eventsEnabled ? (events ?? []) : []} />
    </div>
  );
};

export default MapPage;
