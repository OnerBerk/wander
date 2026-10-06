import { EventData } from '@wander/types';
import Barcode from '@/components/cards/barcode';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import { formatEventDate } from '@/utils/card-utils';
import { getOptimizedImageUrl } from '@/utils/get-optimized-image-url';

const PRIORITY_CARD_COUNT = 4;

interface EventCardProps {
  event: EventData;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const date = formatEventDate(event.dateStart);
  const option = EVENT_TAG_OPTIONS.find((item) => event.tags.includes(item.value));
  const isPriority = index < PRIORITY_CARD_COUNT;

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
            src={getOptimizedImageUrl(event.coverUrl, 640)}
            srcSet={`${getOptimizedImageUrl(event.coverUrl, 384)} 384w, ${getOptimizedImageUrl(event.coverUrl, 640)} 640w`}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 36vw, 70vw"
            alt={event.coverAlt ?? event.title}
            width={384}
            height={439}
            className="h-full w-full object-cover"
            {...(isPriority
              ? { fetchPriority: 'high' as const }
              : { loading: 'lazy' as const, decoding: 'async' as const })}
          />
        )}
      </div>
      <div className="flex items-center gap-1 p-1">
        <p className="shrink-0 text-[22px] font-medium capitalize">{`${date.day} ${date.dayNum}`}</p>
        <div className="h-0.5 min-w-0 flex-1 bg-current" aria-hidden />
        <p className="apitalize shrink-0 text-[22px] font-medium capitalize">{date.month}</p>
      </div>
      <h2 className="flex h-20 items-center justify-center text-center">
        <span className="line-clamp-3 text-[14px] capitalize sm:text-[19px]">{event.title.toLocaleLowerCase()}</span>
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
          <div className="hidden sm:contents">
            <Barcode />
          </div>
        </div>
      </div>
    </li>
  );
};

export default EventCard;
