import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import usePanelStore from '@/store/zustand/usePanelStore';
import velibMarkerImageUrl from '@/assets/markers/bike/marker-bike.png';
import subwayMarkerImageUrl from '@/assets/markers/subway/marker-subway.png';
import spaceInvaderMarkerImageUrl from '@/assets/markers/invaders/marker-invaders.png';
import HexagonBadge from '@/ui-components/hexagon-badge';
import Filters from './filters';
import { useId } from 'react';
import UIClosePanelButton from '@/ui-components/ui-close-panel-button';

const FilterPanel = () => {
  const titleId = useId();
  const isPanelOpen = usePanelStore((state) => state.isPanelOpen);
  const closePanel = usePanelStore((state) => state.closePanel);
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);
  const isMetroMarkersVisible = useMapLayersStore((state) => state.isMetroMarkersVisible);
  const isSpaceInvadersVisible = useMapLayersStore((state) => state.isSpaceInvadersVisible);
  const toggleVelibMarkers = useMapLayersStore((state) => state.toggleVelibMarkers);
  const toggleMetroMarkers = useMapLayersStore((state) => state.toggleMetroMarkers);
  const toggleSpaceInvaders = useMapLayersStore((state) => state.toggleSpaceInvaders);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!isPanelOpen}
      className={`absolute top-0 right-0 z-100 hidden h-full w-100 flex-col gap-2 border-l-2 border-white/30 px-4 pt-8 backdrop-blur-sm transition-transform duration-500 ease-in-out md:flex ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <UIClosePanelButton ariaLabel="Fermer les filtres" onClose={closePanel} />

      <div className="flex flex-col justify-center gap-2 p-2">
        <div className="text-xl font-bold">Metro et Vélib et Space Invaders</div>
        <div className="filter-panel grid grid-cols-3 gap-2">
          <HexagonBadge
            label="Métro"
            icon={subwayMarkerImageUrl}
            selected={isMetroMarkersVisible}
            onClick={toggleMetroMarkers}
            ariaLabel="stations métro et RER"
            className="max-w-24"
          />
          <HexagonBadge
            label="Vélib"
            icon={velibMarkerImageUrl}
            selected={isVelibMarkersVisible}
            onClick={toggleVelibMarkers}
            ariaLabel="stations Vélib"
            className="max-w-24"
          />
          <HexagonBadge
            label="Invaders"
            icon={spaceInvaderMarkerImageUrl}
            selected={isSpaceInvadersVisible}
            onClick={toggleSpaceInvaders}
            ariaLabel="Space Invaders"
            className="max-w-24"
          />
        </div>
      </div>
      <div className="text-xl font-bold">Filtrer vos événements</div>
      <div className="tag-filters flex gap-2">
        <Filters />
      </div>
      <p className="mt-auto px-2 pb-1 text-[10px] text-slate-600">
        ©{' '}
        <a className="underline" href="https://www.maptiler.com/" target="_blank" rel="noreferrer">
          MapTiler
        </a>{' '}
        ©{' '}
        <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          OpenStreetMap contributors
        </a>
      </p>
    </div>
  );
};

export default FilterPanel;
