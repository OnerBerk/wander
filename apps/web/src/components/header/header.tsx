import { useWeather } from '@/api/features/weather/queries/use-weather';
import wanderLogoPaper from '@/assets/logo/wander-logo-paper.png';

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
          <img className="h-20" src={wanderLogoPaper} alt="Wander" />
          <div className="hidden flex-col items-center md:block">
            <p className="text-wander-orange text-3xl font-semibold md:text-5xl">Wander</p>
            <p className="text-xs font-medium md:text-base">Explorer votre ville autrement</p>
          </div>
        </div>
        <div className="flex h-16 items-start justify-between gap-2">
          {icon && <img className="h-40 w-auto shrink-0" src={icon.src} alt={icon.alt} />}
          <div className="flex h-full flex-col justify-center">
            <p className={`text-2xl font-semibold`}>{weather ? `${weather?.temperature}°C` : ''}</p>
            <p className="text-sm md:text-base">{weather ? `${weather?.windSpeed} km/h` : ''}</p>
          </div>
          <LucideEllipsisVertical className="mt-4" aria-hidden="true" />
          <button
            type="button"
            aria-label="Ouvrir les filtres"
            onClick={togglePanel}
            className="focus-visible:ring-wander-orange mt-4 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <SlidersHorizontal className="h-8 w-auto" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
