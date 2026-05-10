import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import usePanelStore from '@/store/zustand/usePanelStore';
import velibMarkerImageUrl from '@/assets/markers/bike/marker-bike.png';
import subwayMarkerImageUrl from '@/assets/markers/subway/marker-subway.png';
import spaceInvaderMarkerImageUrl from '@/assets/markers/marker-space-invaders.png';
import Filters from './filters';

const FilterPanel = () => {
  const isPanelOpen = usePanelStore((state) => state.isPanelOpen);
  const togglePanel = usePanelStore((state) => state.togglePanel);
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);
  const isMetroMarkersVisible = useMapLayersStore((state) => state.isMetroMarkersVisible);
  const isSpaceInvadersVisible = useMapLayersStore((state) => state.isSpaceInvadersVisible);
  const toggleVelibMarkers = useMapLayersStore((state) => state.toggleVelibMarkers);
  const toggleMetroMarkers = useMapLayersStore((state) => state.toggleMetroMarkers);
  const toggleSpaceInvaders = useMapLayersStore((state) => state.toggleSpaceInvaders);

  return (
    <div
      className={`absolute p-4 z-10 flex flex-col gap-2 border-white/30 bg-[#FFFAFA]/30 backdrop-blur-md will-change-transform transition-transform duration-500 ease-in-out
        bottom-0 left-0 h-full w-full border-t-2 md:bottom-auto md:left-auto
        md:top-0 md:right-0 md:h-full md:w-100 md:border-t-0 md:border-l-2
        ${isPanelOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
      <div className='w-full h-20 hidden md:flex items-center justify-center gap-2 p-2'>
        <img className={`h-15`} src='/wander-logo.png' alt='Wander' />
        <h1 className='md:text-3xl text-xl font-bold'>Filtres</h1>
      </div>
      <div className='p-2 flex flex-col justify-center gap-2'>
        <div className='md:text-xl text-lg font-bold'>Metro et Vélib et Space Invaders</div>
        <div className='flex   gap-2'>
          <button
            type='button'
            aria-pressed={isMetroMarkersVisible}
            aria-label={isVelibMarkersVisible ? 'Masquer les markers Vélib' : 'Afficher les markers Vélib'}
            onClick={toggleVelibMarkers}
            className='relative flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 md:h-12 md:w-12'>
            <img
              src={velibMarkerImageUrl}
              alt=''
              className={`h-6 w-6 object-contain transition md:h-9 md:w-9 ${isVelibMarkersVisible ? '' : 'grayscale opacity-40'}`}
            />
            {!isVelibMarkersVisible && (
              <span className='absolute h-0.5 w-8 rotate-45 rounded-full bg-slate-700 md:w-10' />
            )}
          </button>
          <button
            type='button'
            aria-pressed={isMetroMarkersVisible}
            aria-label={
              isMetroMarkersVisible ? 'Masquer les stations métro et RER' : 'Afficher les stations métro et RER'
            }
            onClick={toggleMetroMarkers}
            className='relative flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 md:h-12 md:w-12'>
            <img
              src={subwayMarkerImageUrl}
              alt=''
              className={`h-6 w-6 object-contain transition md:h-9 md:w-9 ${isMetroMarkersVisible ? '' : 'grayscale opacity-40'}`}
            />
            {!isMetroMarkersVisible && (
              <span className='absolute h-0.5 w-8 rotate-45 rounded-full bg-slate-700 md:w-10' />
            )}
          </button>
          <button
            type='button'
            aria-pressed={isSpaceInvadersVisible}
            aria-label={isSpaceInvadersVisible ? 'Masquer les Space Invaders' : 'Afficher les Space Invaders'}
            onClick={toggleSpaceInvaders}
            className='relative flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 md:h-12 md:w-12'>
            <img
              src={spaceInvaderMarkerImageUrl}
              alt=''
              className={`h-6 w-6 object-contain transition md:h-9 md:w-9 ${isSpaceInvadersVisible ? '' : 'grayscale opacity-40'}`}
            />
            {!isSpaceInvadersVisible && (
              <span className='absolute h-0.5 w-8 rotate-45 rounded-full bg-slate-700 md:w-10' />
            )}
          </button>
        </div>
      </div>
      <div className='md:text-xl text-lg font-bold'>Filtrer vos événements</div>
      <div className='flex gap-2'>
        <Filters onSubmit={togglePanel} />
      </div>
    </div>
  );
};

export default FilterPanel;
