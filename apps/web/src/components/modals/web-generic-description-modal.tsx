import { markerModalBaseClassName } from './modal-styles';
import VelibModal from './velib-modal';
import EventModal from './event-modal';
import MetroStationModal from './metro-station-modal';
import useMarkerStore from '@/store/zustand/useMarkerStore';

const WebGenericDescriptionModal: React.FC = () => {
  const detailModal = useMarkerStore((state) => state.detailModal);
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);

  if (detailModal.type === undefined) {
    return null;
  }

  const isEventModal = detailModal.type === 'event';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="web-generic-description-modal"
      className={markerModalBaseClassName}
      onClick={closeDetailModal}
    >
      <div
        className={isEventModal ? 'h-[85vh] min-h-0 md:h-[50vh]' : 'h-auto'}
        onClick={(event) => event.stopPropagation()}
      >
        {detailModal.type === 'event' && <EventModal event={detailModal.data} />}
        {detailModal.type === 'bike' && <VelibModal station={detailModal.data} />}
        {detailModal.type === 'metro' && <MetroStationModal station={detailModal.data} />}
      </div>
    </div>
  );
};

export default WebGenericDescriptionModal;
