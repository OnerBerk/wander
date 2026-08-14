import { DateTime } from 'luxon';
import { EventData } from '@wander/types';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface EventListItemProps {
  event: EventData;
}

const formatEventDates = (dateStart: string, dateEnd: string): string => {
  const start = DateTime.fromISO(dateStart).setLocale('fr');
  const end = DateTime.fromISO(dateEnd).setLocale('fr');

  if (!start.isValid) {
    return '';
  }

  if (!end.isValid || start.hasSame(end, 'day')) {
    return start.toLocaleString(DateTime.DATE_MED);
  }

  return `${start.toLocaleString(DateTime.DATE_MED)} – ${end.toLocaleString(DateTime.DATE_MED)}`;
};

const EventListItem = ({ event }: EventListItemProps) => {
  const openEventDetail = useMarkerStore((state) => state.openEventDetail);
  const dates = formatEventDates(event.dateStart, event.dateEnd);
  const place = [event.addressName, event.addressCity].filter(Boolean).join(', ');

  return (
    <article>
      <button
        type="button"
        onClick={() => openEventDetail(event)}
        className="focus-visible:ring-wander-orange flex w-full gap-4 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-wander-orange/40 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      >
        {event.coverUrl ? (
          <img
            src={event.coverUrl}
            alt={event.coverAlt ?? ''}
            className="h-24 w-24 shrink-0 rounded-xl object-cover md:h-28 md:w-28"
            loading="lazy"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-wander-text text-base font-semibold md:text-lg">{event.title}</h3>
          {dates ? (
            <time className="text-wander-orange mt-1 block text-sm font-medium" dateTime={event.dateStart}>
              {dates}
            </time>
          ) : null}
          {place ? <p className="mt-1 truncate text-sm text-slate-600">{place}</p> : null}
          {event.leadText ? <p className="mt-2 line-clamp-2 text-sm text-slate-700">{event.leadText}</p> : null}
        </div>
      </button>
    </article>
  );
};

export default EventListItem;
