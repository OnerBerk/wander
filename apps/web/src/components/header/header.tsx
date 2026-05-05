import {useWeather} from '@/api/features/weather/queries/use-weather';
import {useIsDay} from '@/hooks/useIsDay';
import {useWeatherIcon} from '@/hooks/useWeatherIcon';
import HeaderFilters from '@/components/header/header-filters';

const Header = () => {
  const {data: weather} = useWeather();
  const isDay = useIsDay();
  const icon = useWeatherIcon();

  return (
    <header className={`relative z-10 h-20 shrink-0 p-2 ${isDay ? 'header-day' : 'header-night'}`}>
      <div className='font-alternate flex h-16 justify-between'>
        <div className='flex items-center gap-3'>
          <img className={`h-15`} src='/wander-logo.png' alt='Wander' />
          <div className='flex flex-col'>
            <h1 className='text-wander-orange text-3xl md:text-5xl font-semibold'>Wander</h1>
            <p className='font-medium text-sm md:text-base'>Explorer votre ville autrement</p>
          </div>
        </div>
        <div className='flex items-center justify-between gap-2'>
          {icon && <img className='h-15' src={icon} alt={icon} />}
          <div className='flex flex-col'>
            <p className={`text-2xl font-semibold`}>{weather ? `${weather?.temperature}°C` : ''}</p>
            <p className=' text-sm md:text-base'>{weather ? `${weather?.windSpeed} km/h` : ''}</p>
          </div>
        </div>
      </div>
      <div className='absolute w-auto bottom-0 left-1/2 flex h-15  -translate-x-1/2 translate-y-full items-center rounded-b-2xl border-x border-b border-white/30 bg-white/25 px-4 backdrop-blur-md'>
        <HeaderFilters />
      </div>
    </header>
  );
};
export default Header;
