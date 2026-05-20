import { markerModalBaseClassName } from './modal-styles';
import VelibModal from './velib-modal';
import EventModal from './event-modal';
import MetroStationModal from './metro-station-modal';
import useMarkerStore from '@/store/zustand/useMarkerStore';

const WebGenericDescriptionModal: React.FC = () => {
  const detailModal = useMarkerStore((state) => state.detailModal);

  if (detailModal.type === undefined) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="web-generic-description-modal"
      className={markerModalBaseClassName}
    >
      {detailModal.type === 'event' && <EventModal event={detailModal.data} />}
      {detailModal.type === 'bike' && <VelibModal station={detailModal.data} />}
      {detailModal.type === 'metro' && <MetroStationModal station={detailModal.data} />}
    </div>
  );
};

export default WebGenericDescriptionModal;
