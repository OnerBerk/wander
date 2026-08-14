import { useEvents } from '@/api/features/events/useEvents';
import EventListItem from '@/components/events/event-list-item';
import WebGenericDescriptionModal from '@/components/modals/web-generic-description-modal';
import Filters from '@/components/panel/filters';
import SeoMetadata from '@/components/seo/seo-metadata';
import useFilterStore from '@/store/zustand/useFilterStore';
import { EventData } from '@wander/types';

const HOME_TITLE = 'Wander | Événements à Paris';
const HOME_DESCRIPTION =
  'Découvrez les événements à Paris : expos, musées, festivals et concerts. Filtrez par envie et explorez la ville sur une carte interactive, avec Vélib, métro et météo en temps réel.';

const renderEventList = (events: EventData[]) => {
  if (events.length === 0) {
    return <p className="text-slate-600">Aucun événement pour ces filtres.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {events.map((event) => (
        <li key={event.id}>
          <EventListItem event={event} />
        </li>
      ))}
    </ul>
  );
};

const HomePage = () => {
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);
  const { data: events, isPending, isError } = useEvents();

  const renderEventsSection = () => {
    if (!eventsEnabled) {
      return <p className="text-slate-600">Aucun événement pour ces filtres.</p>;
    }

    if (isPending) {
      return <p className="text-slate-600">Chargement des événements…</p>;
    }

    if (isError) {
      return <p className="text-slate-600">Impossible de charger les événements pour le moment.</p>;
    }

    return renderEventList(events ?? []);
  };

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#F6F6FA]">
      <SeoMetadata title={HOME_TITLE} description={HOME_DESCRIPTION} canonicalPath="/" />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-16 pb-10 md:px-6 md:pt-8 md:pb-16">
        <section>
          <h1 className="text-wander-orange text-4xl font-bold md:text-6xl">Wander</h1>
          <p className="text-wander-text mt-2 text-lg font-medium md:text-xl">Que faire à Paris aujourd&apos;hui</p>
          <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
            Une carte vivante qui rassemble tout ce qui se passe à Paris — expos, musées, festivals, concerts. Filtrez
            par envie, par budget. Trouvez quoi faire aujourd&apos;hui, ce week-end, ou là tout de suite.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">
            Et pour rendre la sortie facile : Vélib en temps réel, stations de métro à proximité, météo à l&apos;instant
            T. Passez en mode carte quand vous voulez voir où ça se passe.
          </p>
        </section>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-80 lg:shrink-0">
            <h2 className="text-wander-text mb-3 text-lg font-semibold">Filtrer les événements</h2>
            <Filters />
          </aside>
          <section className="min-w-0 flex-1">
            <h2 className="text-wander-text mb-3 text-lg font-semibold">Événements</h2>
            {renderEventsSection()}
          </section>
        </div>
      </div>
      <WebGenericDescriptionModal />
    </main>
  );
};

export default HomePage;
