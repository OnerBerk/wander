import { VelibStation } from '@wander/types';
import { markerModalBaseClassName } from '@/components/modals/modal-styles';
import { useId } from 'react';
import UIClosePanelButton from '@/ui-components/ui-close-panel-button';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface VelibModalProps {
  station: VelibStation;
}

const VelibModal: React.FC<VelibModalProps> = ({ station }) => {
  const titleId = useId();
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={`${markerModalBaseClassName} w-[min(85vw,250px)] md:max-w-[250px]`}
    >
      <UIClosePanelButton ariaLabel="Fermer le détail de la station Vélib" onClose={closeDetailModal} />
      <h2 id={titleId} className="text-lg font-semibold md:text-xl">
        {station.name}
      </h2>
      <p className="text-xs md:text-sm">Vélos disponibles : {station.bikesAvailable}</p>
      <p className="text-xs md:text-sm">Places disponibles : {station.docksAvailable}</p>
      <p className="text-xs md:text-sm">Vélos mécaniques : {station.mechanical}</p>
      <p className="text-xs md:text-sm">Vélos électriques : {station.ebike}</p>
    </div>
  );
};

export default VelibModal;
