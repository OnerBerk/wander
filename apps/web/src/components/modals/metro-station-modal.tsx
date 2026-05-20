import { MetroStation } from '@/types/metro-station';
import { metroIconByLine, rerIconByLine } from '@/components/modals/utils';
import { useId } from 'react';
import UIClosePanelButton from '@/ui-components/ui-close-panel-button';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface MetroStationModalProps {
  station: MetroStation;
}

const renderLineIcons = (lines: string[], iconMap: Record<string, string>) => {
  if (lines.length === 0) {
    return <p className="text-xs md:text-sm">Aucune ligne</p>;
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 md:gap-2">
      {lines.map((line) => {
        const iconUrl = iconMap[line.toUpperCase()];

        if (iconUrl) {
          return (
            <img key={line} src={iconUrl} alt={`Ligne ${line}`} className="h-6 w-6 object-contain md:h-8 md:w-8" />
          );
        }

        return (
          <span
            key={line}
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-slate-300 px-1.5 text-[10px] font-semibold text-slate-700 md:h-8 md:min-w-8 md:px-2 md:text-xs"
          >
            {line}
          </span>
        );
      })}
    </div>
  );
};

const MetroStationModal: React.FC<MetroStationModalProps> = ({ station }) => {
  const titleId = useId();
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);

  return (
    <div className="relative w-full p-2">
      <UIClosePanelButton ariaLabel="Fermer le détail de la station métro" onClose={closeDetailModal} />
      <h2 id={titleId} className="pr-10 text-xl font-semibold md:text-3xl">
        {station.name}
      </h2>
      <div className="mt-2 flex flex-col gap-3 text-xs md:gap-5 md:text-sm">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <p className="text-lg font-semibold md:text-2xl">Metro</p>
          {renderLineIcons(station.metroLines, metroIconByLine)}
        </div>
        <div className="flex flex-col gap-1.5 md:gap-2">
          <p className="text-lg font-semibold md:text-2xl">RER</p>
          {renderLineIcons(station.rerLines, rerIconByLine)}
        </div>
      </div>
    </div>
  );
};

export default MetroStationModal;
