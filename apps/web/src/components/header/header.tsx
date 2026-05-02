import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {useWeather} from '@/api/features/weather/queries/use-weather';
import {useIsDay} from '@/hooks/useIsDay';
import {useWeatherIcon} from '@/hooks/useWeatherIcon';
import HeaderFilters from '@/components/header/header-filters';

const Header = () => {
  const {data: weather} = useWeather();
  const isDay = useIsDay();
  const icon = useWeatherIcon();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <header
      className={`relative z-10 h-20 shrink-0 p-2 ${isDay ? 'header-day' : 'header-night'}`}>
      <div className='font-alternate flex h-16 justify-between'>
        <div className='flex items-center gap-3'>
          <img className={`h-15`} src='/wander-logo.png' alt='Wander' />
          <h1 className='text-wander-orange text-3xl md:text-5xl font-semibold'>Wander</h1>
        </div>
        <div className='flex items-center justify-between gap-2'>
          {icon && <img className='h-15' src={icon} alt={icon} />}
          <p className={`text-2xl md:text-3xl font-semibold`}>{`${weather?.temperature}°C`}</p>
        </div>
      </div>
      {isFiltersOpen && <HeaderFilters />}
      <button
        type='button'
        aria-expanded={isFiltersOpen}
        aria-label={isFiltersOpen ? 'Replier les filtres' : 'Déplier les filtres'}
        onClick={() => setIsFiltersOpen((current) => !current)}
        className='absolute bottom-0 left-1/2 flex h-8 w-14 -translate-x-1/2 translate-y-full items-center justify-center rounded-b-2xl border-x border-b border-white/30 bg-white/25 backdrop-blur-md'>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </header>
  );
};
export default Header;
