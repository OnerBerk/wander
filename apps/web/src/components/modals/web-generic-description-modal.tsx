import { markerModalBaseClassName } from './modal-styles';
import VelibModal from './velib-modal';
import MetroStationModal from './metro-station-modal';
import EventCard from '@/components/cards/event-card';
import useMarkerStore from '@/store/zustand/useMarkerStore';

const WebGenericDescriptionModal: React.FC = () => {
  const detailModal = useMarkerStore((state) => state.detailModal);
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);

  if (detailModal.type === undefined) {
    return null;
  }

  if (detailModal.type === 'event') {
    return (
      <>
        <button type="button" aria-label="Fermer" className="fixed inset-0 z-40" onClick={closeDetailModal} />
        <ul className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-17rem)] w-[min(75vw,20rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto">
          <EventCard event={detailModal.data} index={0} from="/map" />
        </ul>
      </>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="web-generic-description-modal"
      className={markerModalBaseClassName}
      onClick={closeDetailModal}
    >
      <div className="h-auto" onClick={(event) => event.stopPropagation()}>
        {detailModal.type === 'bike' && <VelibModal station={detailModal.data} />}
        {detailModal.type === 'metro' && <MetroStationModal station={detailModal.data} />}
      </div>
    </div>
  );
};

export default WebGenericDescriptionModal;
