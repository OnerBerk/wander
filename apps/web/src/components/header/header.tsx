import {useWeather} from '@/api/features/weather/queries/use-weather';

import usePanelStore from '@/store/zustand/usePanelStore';
import {useIsDay} from '@/hooks/useIsDay';

import {LucideEllipsisVertical, LucidePanelLeft, LucidePanelRight} from 'lucide-react';
import {useWeatherIcon} from '@/hooks/useWeatherIcon';

const Header = () => {
  const {data: weather} = useWeather();
  const icon = useWeatherIcon();
  const isDay = useIsDay();

  const togglePanel = usePanelStore((state) => state.togglePanel);
  const isPanelOpen = usePanelStore((state) => state.isPanelOpen);

  return (
    <header className={`relative z-10 h-20 shrink-0 p-2 ${isDay ? 'header-day' : 'header-night'}`}>
      <div className='font-alternate flex h-16 justify-between'>
        <div className='flex items-center gap-3'>
          <img className={`h-15`} src='/wander-logo.png' alt='Wander' />
          <div className='hidden flex-col md:block items-center'>
            <h1 className=' text-wander-orange text-3xl md:text-5xl font-semibold'>Wander</h1>
            <p className='font-medium text-xs md:text-base'>Explorer votre ville autrement</p>
          </div>
        </div>
        <div className='flex items-center justify-between gap-2'>
          {icon && <img className='h-15 w-auto md:h-15' src={icon} alt={icon} />}
          <div className='flex flex-col'>
            <p className={`text-2xl font-semibold`}>{weather ? `${weather?.temperature}°C` : ''}</p>
            <p className=' text-sm md:text-base'>{weather ? `${weather?.windSpeed} km/h` : ''}</p>
          </div>
          <LucideEllipsisVertical />
          {isPanelOpen && <LucidePanelLeft className='h-8 w-auto cursor-pointer' onClick={togglePanel} />}
          {!isPanelOpen && <LucidePanelRight className='h-8 w-auto cursor-pointer' onClick={togglePanel} />}
        </div>
      </div>
    </header>
  );
};
export default Header;
