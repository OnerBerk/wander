import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import usePanelStore from '@/store/zustand/usePanelStore';
import wanderLogoPaper from '@/assets/logo/wander-logo-paper.png';
import velibMarkerImageUrl from '@/assets/markers/bike/marker-bike.png';
import subwayMarkerImageUrl from '@/assets/markers/subway/marker-subway.png';
import spaceInvaderMarkerImageUrl from '@/assets/markers/marker-space-invaders.png';
import Filters from './filters';
import UIIconButton from '../ui/ui-icon-button';
import { useId } from 'react';
import UIClosePanelButton from '@/components/ui/ui-close-panel-button';

const FilterPanel = () => {
  const titleId = useId();
  const isPanelOpen = usePanelStore((state) => state.isPanelOpen);
  const togglePanel = usePanelStore((state) => state.togglePanel);
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
      className={`absolute top-0 right-0 z-10 hidden h-full w-100 flex-col gap-2 border-l-2 border-white/30 bg-[#FFFAFA]/30 p-4 backdrop-blur-md transition-transform duration-500 ease-in-out md:flex ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <UIClosePanelButton ariaLabel="Fermer les filtres" onClose={closePanel} />
      <div className="flex h-20 w-full items-center justify-center gap-2 p-2">
        <img className="h-25" src={wanderLogoPaper} alt="Wander" />
        <h2 id={titleId} className="text-3xl font-bold">
          Filtres
        </h2>
      </div>
      <div className="flex flex-col justify-center gap-2 p-2">
        <div className="text-xl font-bold">Metro et Vélib et Space Invaders</div>
        <div className="flex gap-2">
          <UIIconButton
            isVisible={isMetroMarkersVisible}
            onToggle={toggleMetroMarkers}
            icon={subwayMarkerImageUrl}
            label="stations métro et RER"
          />
          <UIIconButton
            isVisible={isVelibMarkersVisible}
            onToggle={toggleVelibMarkers}
            icon={velibMarkerImageUrl}
            label="stations Vélib"
          />
          <UIIconButton
            isVisible={isSpaceInvadersVisible}
            onToggle={toggleSpaceInvaders}
            icon={spaceInvaderMarkerImageUrl}
            label="Space Invaders"
          />
        </div>
      </div>
      <div className="text-xl font-bold">Filtrer vos événements</div>
      <div className="flex gap-2">
        <Filters onSubmit={togglePanel} />
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
