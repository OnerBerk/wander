import { EventData } from '@wander/types';
import { DateTime } from 'luxon';
import { useId } from 'react';
import EventTagIcons from '@/components/modals/event-tag-icons';
import UIClosePanelButton from '@/ui-components/ui-close-panel-button';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface EventModalProps {
  event: EventData;
}

const EventModal: React.FC<EventModalProps> = ({ event }) => {
  const titleId = useId();
  const infosTitleId = useId();
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);

  const mapsUrl = `https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`;
  const addressLine = `${event.addressStreet}, ${event.addressZipcode} ${event.addressCity}`;

  return (
    <div key={event.id} className="relative h-full w-full">
      <UIClosePanelButton ariaLabel="Fermer le détail de l'événement" onClose={closeDetailModal} />

      <div className="flex h-full min-h-0 flex-col items-center justify-center gap-1 md:hidden">
        <section className="animate-event-modal-slide-down flex min-h-0 basis-1/2 flex-col items-center justify-center overflow-hidden rounded-t-2xl bg-[#f4b400]/85 p-2">
          <h2 id={titleId} className="px-4 pt-2 text-center text-lg font-semibold">
            {event.title}
          </h2>
          <EventTagIcons tags={event.tags} iconClassName="h-20 w-20 shrink-0 object-contain" />
          {event.description ? (
            <div
              className="scrollbar-subtle min-h-0 flex-1 justify-center overflow-y-auto p-4 text-justify text-xs [&_p]:text-justify"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          ) : null}
        </section>

        <section className="animate-event-modal-slide-left flex min-h-0 w-full basis-1/4 flex-col gap-2 overflow-y-auto bg-[#111827]/85 p-2 text-white">
          <h3 id={infosTitleId} className="text-center text-lg font-semibold">
            Infos pratiques
          </h3>
          <p className="text-xs">{DateTime.fromISO(event.dateStart).toLocaleString(DateTime.DATE_MED)}</p>
          <p className="text-xs">{event.addressName}</p>
          <p className="text-xs">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wander-orange font-semibold underline"
            >
              {addressLine}
            </a>
          </p>
        </section>

        <section className="animate-event-modal-slide-right-m min-h-0 w-full basis-1/4 overflow-hidden rounded-b-2xl bg-[#F6F6FA]/85">
          {event.coverUrl ? (
            <img src={event.coverUrl} alt={event.coverAlt ?? ''} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs">No cover</div>
          )}
        </section>
      </div>

      <div className="hidden h-full min-h-0 grid-cols-[60fr_40fr] gap-1 md:grid md:overflow-hidden">
        <div className="md:animate-event-modal-slide-up flex min-h-0 flex-col items-center gap-2 overflow-hidden bg-[#f4b400]/85 p-2 md:rounded-l-2xl">
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

        <div className="grid min-h-0 grid-rows-[7fr_3fr] gap-1">
          <div className="md:animate-event-modal-slide-right-1st flex min-h-0 flex-col gap-2 overflow-y-auto bg-[#111827]/85 p-2 text-white md:rounded-tr-2xl">
            <h3 id={infosTitleId} className="text-center text-lg font-semibold md:text-xl">
              Infos pratiques
            </h3>
            <p className="text-xs md:text-sm">{DateTime.fromISO(event.dateStart).toLocaleString(DateTime.DATE_MED)}</p>
            <p className="text-xs md:text-sm">{event.addressName}</p>
            <p className="text-xs md:text-sm">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wander-orange font-semibold underline"
              >
                {addressLine}
              </a>
            </p>
          </div>
          <div className="md:animate-event-modal-slide-right-2nd min-h-0 overflow-hidden bg-[#F6F6FA]/85 md:rounded-br-2xl">
            {event.coverUrl ? (
              <img src={event.coverUrl} alt={event.coverAlt ?? ''} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs md:text-sm">No cover</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
