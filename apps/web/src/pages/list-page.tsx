import { useEvents } from '@/api/features/events/useEvents';
import FilterPanelList from '@/components/panel/filter-panel-list';
import SeoMetadata from '@/components/seo/seo-metadata';
import useFilterStore from '@/store/zustand/useFilterStore';
import bgMarine from '@/assets/bg/bg-marine.png';
import EventCard from '@/components/cards/event-card';
import EventCardSkeleton from '@/components/cards/event-card-skeleton';
import { useIncrementalList } from '@/hooks/use-incremental-list';
import { EventData } from '@wander/types';

const EMPTY_EVENTS: EventData[] = [];

const ListPage = () => {
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);
  const { data: events, isLoading } = useEvents();
  const visibleEvents = eventsEnabled && events ? events : EMPTY_EVENTS;
  const { visibleItems, sentinelRef, scrollerRef, hasMore } = useIncrementalList(visibleEvents);

  return (
    <main className="scrollbar-hidden z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
      <SeoMetadata
        title="Wander | Événements à Paris et en Île-de-France"
        description="Découvrez les événements culturels à Paris et en Île-de-France : concerts, expos, spectacles et sorties, avec une vue liste et une carte interactive."
        canonicalPath="/"
      />
      <div className="w-full shrink-0 pt-5" style={{ backgroundImage: `url(${bgMarine})` }}>
        <FilterPanelList />
      </div>
      <div
        ref={scrollerRef}
        className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto bg-contain bg-center text-amber-50"
        style={{ backgroundImage: `url(${bgMarine})` }}
      >
        <div className="mx-auto flex w-[75%] max-w-450 flex-col items-start">
          {!isLoading && visibleEvents.length === 0 && (
            <p className="mt-8 text-sm text-slate-500">Aucun événement pour ces filtres.</p>
          )}

          <ul className="mt-8 grid w-full grid-cols-1 gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:mx-auto xl:max-w-7xl xl:grid-cols-4">
            {isLoading && eventsEnabled
              ? Array.from({ length: 8 }, (_, index) => <EventCardSkeleton key={index} />)
              : visibleItems.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
          </ul>
          {hasMore && <div ref={sentinelRef} className="h-px w-full" aria-hidden />}
        </div>
      </div>
    </main>
  );
};

export default ListPage;
