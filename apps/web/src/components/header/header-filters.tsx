import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import velibMarkerImageUrl from '@/assets/markers/bike/marker-bike.png';
import subwayMarkerImageUrl from '@/assets/markers/subway/marker-subway.png';

const HeaderFilters = () => {
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);
  const isMetroMarkersVisible = useMapLayersStore((state) => state.isMetroMarkersVisible);
  const toggleVelibMarkers = useMapLayersStore((state) => state.toggleVelibMarkers);
  const toggleMetroMarkers = useMapLayersStore((state) => state.toggleMetroMarkers);

  return (
    <div className='flex w-full items-center gap-3'>
      <button
        type='button'
        aria-pressed={isVelibMarkersVisible}
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
        aria-label={isMetroMarkersVisible ? 'Masquer les stations métro et RER' : 'Afficher les stations métro et RER'}
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
    </div>
  );
};

export default HeaderFilters;
