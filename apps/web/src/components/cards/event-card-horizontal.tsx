import { EventData } from '@wander/types';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import { formatEventDate } from '@/utils/card-utils';
import { eventPath } from '@/utils/event-path';
import { getOptimizedImageUrl } from '@/utils/get-optimized-image-url';
import { Link } from 'react-router-dom';

const PRIORITY_CARD_COUNT = 4;

interface EventCardHorizontalProps {
  event: EventData;
  index: number;
  from?: '/' | '/map';
}

const EventCardHorizontal = ({ event, index, from = '/' }: EventCardHorizontalProps) => {
  const date = formatEventDate(event.dateStart);
  const option = EVENT_TAG_OPTIONS.find((item) => event.tags.includes(item.value));
  const isPriority = index < PRIORITY_CARD_COUNT;

  return (
    <li className="h-40">
      <Link
        to={eventPath(event)}
        state={{ from }}
        className="flex h-full cursor-pointer gap-2 rounded-2xl p-2"
        style={{
          backgroundColor: option?.bg ?? '#FAF8F6',
          color: option?.color ?? '#25344F',
        }}
      >
        <div className="h-full w-[42%] shrink-0 overflow-hidden rounded-2xl">
          {event.coverUrl && (
            <img
              src={getOptimizedImageUrl(event.coverUrl, 384)}
              srcSet={`${getOptimizedImageUrl(event.coverUrl, 384)} 384w, ${getOptimizedImageUrl(event.coverUrl, 640)} 640w`}
              sizes="42vw"
              alt={event.coverAlt ?? event.title}
              width={384}
              height={384}
              className="h-full w-full object-cover"
              {...(isPriority
                ? { fetchPriority: 'high' as const }
                : { loading: 'lazy' as const, decoding: 'async' as const })}
            />
          )}
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1 overflow-hidden">
          <div className="flex items-center gap-1">
            <p className="shrink-0 text-sm font-medium capitalize">{`${date.day} ${date.dayNum}`}</p>
            <div className="h-0.5 min-w-0 flex-1 bg-current" aria-hidden />
            <p className="shrink-0 text-sm font-medium capitalize">{date.month}</p>
          </div>
          <h2 className="line-clamp-2 text-sm capitalize">{event.title.toLocaleLowerCase()}</h2>
          <div className="mt-auto">
            <div className="border-b-5 border-dotted border-current" aria-hidden />
            <div className="pt-1 text-left">
              <p className="flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Ticket
              </p>
              <p
                className="line-clamp-2 text-[10px]"
                dangerouslySetInnerHTML={{
                  __html: event.description?.toLocaleLowerCase() ?? '',
                }}
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default EventCardHorizontal;
