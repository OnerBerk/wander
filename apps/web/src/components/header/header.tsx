import {useWeather} from '@/api/features/weather/queries/use-weather';
import {useIsDay} from '@/hooks/useIsDay';
import {useWeatherIcon} from '@/hooks/useWeatherIcon';

const Header = () => {
  const {data: weather} = useWeather();
  const isDay = useIsDay();
  const icon = useWeatherIcon();
  console.log(isDay);

  return (
    <header className={`h-auto sm:h-25 p-2 ${isDay ? 'bg-[#A9CBD7]' : 'bg-[#000E38]'}`}>
      <div className='flex justify-between'>
        <div className='flex items-center gap-3'>
          <img className={`h-15 md:h-20 ${!isDay ? 'logo-bg-day' : ''}`} src='/wander-logo.png' alt='Wander' />
          <h1 className='text-3xl md:text-5xl font-bold'>Wander</h1>
        </div>
        <div className='flex items-center justify-between gap-2'>
          {icon && <img className='h-15 md:h-20' src={icon} alt={icon} />}
          <p className={`text-2xl md:text-3xl ${isDay ? '' : 'text-zinc-100'}`}>{`${weather?.temperature}°C`}</p>
        </div>
      </div>
    </header>
  );
};
export default Header;
