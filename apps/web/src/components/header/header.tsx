import { useWeather } from '@/api/features/weather/queries/use-weather';

import usePanelStore from '@/store/zustand/usePanelStore';
import { useIsDay } from '@/hooks/useIsDay';

import { LucideEllipsisVertical, SlidersHorizontal } from 'lucide-react';
import { useWeatherIcon } from '@/hooks/useWeatherIcon';

const Header = () => {
  const { data: weather } = useWeather();
  const icon = useWeatherIcon();
  const isDay = useIsDay();

  const togglePanel = usePanelStore((state) => state.togglePanel);

  return (
    <header className={`relative z-10 hidden h-20 shrink-0 p-2 md:block ${isDay ? 'header-day' : 'header-night'}`}>
      <div className="font-alternate flex h-16 justify-between">
        <div className="flex items-center gap-3">
          <img className={`h-15`} src="/wander-logo.png" alt="Wander" />
          <div className="hidden flex-col items-center md:block">
            <h1 className="text-wander-orange text-3xl font-semibold md:text-5xl">Wander</h1>
            <p className="text-xs font-medium md:text-base">Explorer votre ville autrement</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          {icon && <img className="h-15 w-auto md:h-15" src={icon} alt={icon} />}
          <div className="flex flex-col">
            <p className={`text-2xl font-semibold`}>{weather ? `${weather?.temperature}°C` : ''}</p>
            <p className="text-sm md:text-base">{weather ? `${weather?.windSpeed} km/h` : ''}</p>
          </div>
          <LucideEllipsisVertical />
          <SlidersHorizontal className="h-8 w-auto cursor-pointer" onClick={togglePanel} />
        </div>
      </div>
    </header>
  );
};
export default Header;
