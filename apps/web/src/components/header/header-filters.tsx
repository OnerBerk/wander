import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import velibMarkerImageUrl from '@/assets/markers/bike/marker-bike.png';
import subwayMarkerImageUrl from '@/assets/markers/subway/marker-subway.png';
import {LucideChevronLeft, LucideChevronRight} from 'lucide-react';
import {useState} from 'react';
import Filters from './filters';

const HeaderFilters = () => {
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);
  const isMetroMarkersVisible = useMapLayersStore((state) => state.isMetroMarkersVisible);
  const toggleVelibMarkers = useMapLayersStore((state) => state.toggleVelibMarkers);
  const toggleMetroMarkers = useMapLayersStore((state) => state.toggleMetroMarkers);

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleToggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

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
        {!isVelibMarkersVisible && <span className='absolute h-0.5 w-8 rotate-45 rounded-full bg-slate-700 md:w-10' />}
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
        {!isMetroMarkersVisible && <span className='absolute h-0.5 w-8 rotate-45 rounded-full bg-slate-700 md:w-10' />}
      </button>
      <div className='flex items-center gap-2'>
        <div
          className={`origin-left overflow-hidden transition-all ${
            isFiltersVisible ? 'duration-1000 ease-in-out' : 'duration-500 ease-out'
          } ${
            isFiltersVisible
              ? 'max-w-[min(calc(100vw-5rem),22rem)] translate-x-0 opacity-100'
              : 'max-w-0 -translate-x-1 opacity-0'
          }`}>
          <Filters handleClose={handleToggleFilters} />
        </div>
        {isFiltersVisible ? (
          <LucideChevronLeft onClick={handleToggleFilters} className='h-8 w-8 cursor-pointer' />
        ) : (
          <LucideChevronRight onClick={handleToggleFilters} className='h-8 w-8 cursor-pointer' />
        )}
      </div>
    </div>
  );
};

export default HeaderFilters;
