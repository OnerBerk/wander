import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import velibMarkerImageUrl from '@/assets/markers/bike/marker-bike.png';

const HeaderFilters = () => {
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);
  const toggleVelibMarkers = useMapLayersStore((state) => state.toggleVelibMarkers);

  return (
    <div className='absolute left-1/2 top-full flex min-h-20 w-[min(90vw,900px)] -translate-x-1/2 items-center rounded-b-2xl border-x border-b border-white/30 bg-white/20 px-4 py-3 backdrop-blur-md'>
      <button
        type='button'
        aria-pressed={isVelibMarkersVisible}
        aria-label={isVelibMarkersVisible ? 'Masquer les markers Vélib' : 'Afficher les markers Vélib'}
        onClick={toggleVelibMarkers}
        className='relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20'>
        <img
          src={velibMarkerImageUrl}
          alt=''
          className={`h-9 w-9 object-contain transition ${isVelibMarkersVisible ? '' : 'grayscale opacity-40'}`}
        />
        {!isVelibMarkersVisible && <span className='absolute h-0.5 w-10 rotate-45 rounded-full bg-slate-700' />}
      </button>
      <p className='mx-auto text-sm font-medium'>Filtres</p>
    </div>
  );
};

export default HeaderFilters;
