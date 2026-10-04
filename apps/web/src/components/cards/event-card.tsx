import { EventData } from '@wander/types';
import Barcode from '@/components/cards/barcode';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import { formatEventDate } from '@/utils/card-utils';

interface EventCardProps {
  event: EventData;
}

const EventCard = ({ event }: EventCardProps) => {
  const date = formatEventDate(event.dateStart);
  const option = EVENT_TAG_OPTIONS.find((item) => event.tags.includes(item.value));

  return (
    <li
      className="flex h-full cursor-pointer flex-col gap-1 rounded-2xl p-2"
      style={{
        backgroundColor: option?.bg ?? '#ffffff',
        color: option?.color ?? '#25344F',
      }}
    >
      <div className="aspect-7/8 overflow-hidden rounded-2xl">
        {event.coverUrl && (
          <img
            src={event.coverUrl}
            alt={event.coverAlt ?? event.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex items-center gap-1 p-1">
        <p className="shrink-0 text-[22px] font-medium capitalize">{`${date.day} ${date.dayNum}`}</p>
        <div className="h-0.5 min-w-0 flex-1 bg-current" aria-hidden />
        <p className="apitalize shrink-0 text-[22px] font-medium capitalize">{date.month}</p>
      </div>
      <h2 className="flex h-20 items-center justify-center text-center">
        <span className="line-clamp-3 text-[19px] capitalize">{event.title.toLocaleLowerCase()}</span>
      </h2>
      <div className="mt-auto">
        <div className="border-b-5 border-dotted border-current" aria-hidden />
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="min-w-0 flex-1 text-left">
            <p className="flex items-center gap-1 text-[15px] font-semibold tracking-wide uppercase">
              <span className="h-2 w-2 rounded-full bg-current" />
              Ticket
            </p>
            <p
              className="line-clamp-3 h-12 text-[11px]"
              dangerouslySetInnerHTML={{
                __html: event.description?.toLocaleLowerCase() ?? '',
              }}
            />
          </div>
          <Barcode />
        </div>
      </div>
    </li>
  );
};

export default EventCard;
