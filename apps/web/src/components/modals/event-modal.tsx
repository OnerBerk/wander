import { EventData } from '@wander/types';
import { useId } from 'react';
import UIClosePanelButton from '@/ui-components/ui-close-panel-button';
import useMarkerStore from '@/store/zustand/useMarkerStore';
import { DateTime } from 'luxon';
import EventTagIcons from '@/components/modals/event-tag-icons';

interface EventModalProps {
  event: EventData;
}

const EventModal: React.FC<EventModalProps> = ({ event }) => {
  const titleId = useId();
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);

  return (
    <div
      key={event.id}
      className="relative grid h-full w-full grid-cols-[60fr_40fr] gap-1 md:min-h-0 md:overflow-hidden"
    >
      <UIClosePanelButton ariaLabel="Fermer le détail de l'événement" onClose={closeDetailModal} />
      <div className="md:animate-event-modal-slide-up flex h-full min-h-0 flex-col items-center justify-center gap-2 overflow-hidden bg-[#f4b400]/85 p-2 md:rounded-l-2xl">
        <h2 id={titleId} className="px-4 pt-2 text-center text-lg font-semibold md:text-xl">
          {event.title}
        </h2>
        <EventTagIcons
          tags={event.tags}
          className="gap-3"
          iconClassName="h-15 w-15 shrink-0 object-contain md:h-22 md:w-22"
        />
        {event.description ? (
          <div
            className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto p-4 text-justify text-xs md:text-sm [&_p]:text-justify"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        ) : null}
      </div>
      <div className="grid h-full min-h-0 grid-rows-[6fr_4fr] gap-1 overflow-visible">
        <div className="md:animate-event-modal-slide-right-1st flex min-h-0 flex-col gap-2 overflow-y-auto bg-[#111827]/85 p-2 text-white md:rounded-tr-2xl">
          <h2 id={titleId} className="text-center text-lg font-semibold md:text-xl">
            Infos pratiques
          </h2>

          <p className="text-xs md:text-sm">{DateTime.fromISO(event.dateStart).toLocaleString(DateTime.DATE_MED)}</p>
          <p className="text-xs md:text-sm">{event.addressName}</p>
          <p className="text-xs md:text-sm">
            <a
              href={`https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wander-orange font-semibold underline ..."
            >
              {event.addressStreet}, {event.addressZipcode} {event.addressCity}
            </a>
          </p>
        </div>
        <div className="md:animate-event-modal-slide-right-2nd min-h-0 overflow-hidden bg-[#F6F6FA]/85 md:rounded-br-2xl">
          {event.coverUrl ? (
            <img
              src={event.coverUrl}
              alt={event.coverAlt ?? ''}
              className="h-full w-full rounded-lg object-cover md:rounded-none"
            />
          ) : (
            <div className="max-h-36 w-auto rounded-lg md:max-h-none md:rounded-none">No cover</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
