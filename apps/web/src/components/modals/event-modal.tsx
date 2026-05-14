import { EventData } from '@wander/types';
import { markerModalBaseClassName } from '@/components/modals/modal-styles';
import { DateTime } from 'luxon';
import { useId } from 'react';
import UIClosePanelButton from '@/components/ui/ui-close-panel-button';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface EventModalProps {
  event: EventData;
}

const EventModal: React.FC<EventModalProps> = ({ event }) => {
  const titleId = useId();
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={`${markerModalBaseClassName} w-[min(90vw,560px)] md:max-w-[700px] md:min-w-[300px]`}
    >
      <UIClosePanelButton ariaLabel="Fermer le détail de l'événement" onClose={closeDetailModal} />
      <div className="flex flex-col gap-2">
        <h2 id={titleId} className="text-lg font-semibold md:text-xl">
          {event.title}
        </h2>
        <p className="text-xs md:text-sm">{DateTime.fromISO(event.dateStart).toLocaleString(DateTime.DATE_MED)}</p>
        <p className="text-xs md:text-sm">{event.leadText}</p>
        <p className="text-xs md:text-sm">{event.addressName}</p>
        <p className="text-xs md:text-sm">
          {event.addressStreet}, {event.addressZipcode} {event.addressCity}
        </p>
      </div>
      {event.coverUrl && (
        <img
          src={event.coverUrl}
          alt={event.coverAlt ?? ''}
          className="max-h-36 w-full rounded-lg object-cover md:max-h-none md:rounded-none"
        />
      )}
    </div>
  );
};

export default EventModal;
