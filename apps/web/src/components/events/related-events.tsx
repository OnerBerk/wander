import { EventData } from '@wander/types';
import EventCardHorizontal from '@/components/cards/event-card-horizontal';

interface RelatedEventsProps {
  events: EventData[];
  from?: '/' | '/map';
}

const RelatedEvents = ({ events, from = '/' }: RelatedEventsProps) => {
  if (events.length === 0) return null;

  return (
    <section aria-labelledby="related-events-heading" className="mx-auto mt-8 mb-6 w-full md:w-[75vw]">
      <h2 id="related-events-heading" className="text-wander-black mb-4 text-lg font-bold md:text-2xl">
        Événements similaires
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <EventCardHorizontal key={event.id} event={event} index={index + 4} from={from} />
        ))}
      </ul>
    </section>
  );
};

export default RelatedEvents;
