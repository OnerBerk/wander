import { Link, NavLink, useLocation } from 'react-router-dom';
import { useWeather } from '@/api/features/weather/queries/use-weather';
import wanderLogoPaper from '@/assets/logo/wander-logo-paper.png';

import usePanelStore from '@/store/zustand/usePanelStore';
import { useIsDay } from '@/hooks/useIsDay';

import { LucideEllipsisVertical, SlidersHorizontal } from 'lucide-react';
import { useWeatherIcon } from '@/hooks/useWeatherIcon';

const viewLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `rounded-full px-3 py-1.5 text-xs font-medium transition md:px-4 md:text-sm ${
    isActive ? 'bg-wander-orange text-wander-text-white' : 'text-wander-text hover:bg-white/40'
  }`;

const renderViewSwitch = () => (
  <nav
    aria-label="Mode d'affichage"
    className="flex rounded-full border border-white/40 bg-white/50 p-1 shadow-sm backdrop-blur-md"
  >
    <NavLink to="/" end className={viewLinkClassName}>
      Liste
    </NavLink>
    <NavLink to="/map" className={viewLinkClassName}>
      Carte
    </NavLink>
  </nav>
);

const Header = () => {
  const { data: weather } = useWeather();
  const icon = useWeatherIcon();
  const isDay = useIsDay();
  const isMapRoute = useLocation().pathname === '/map';

  const togglePanel = usePanelStore((state) => state.togglePanel);

  return (
    <div className="shrink-0">
      <div className="fixed top-3 right-3 z-60 md:hidden">{renderViewSwitch()}</div>
      <header className={`relative z-60 hidden h-20 p-2 md:block ${isDay ? 'header-day' : 'header-night'}`}>
        <div className="font-alternate flex h-16 justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img className="h-20" src={wanderLogoPaper} alt="Wander" />
            <div className="hidden flex-col items-center md:block">
              <p className="text-wander-orange text-3xl font-semibold md:text-5xl">Wander</p>
              <p className="text-xs font-medium md:text-base">Explorer votre ville autrement</p>
            </div>
          </Link>
          <div className="flex h-16 items-start justify-between gap-3">
            <div className="mt-3">{renderViewSwitch()}</div>
            {icon && <img className="weather-icon h-40 w-auto shrink-0" src={icon.src} alt={icon.alt} />}
            <div className="weather-info flex h-full flex-col justify-center">
              <p className="text-2xl font-semibold">{weather ? `${weather?.temperature}°C` : ''}</p>
              <p className="text-sm md:text-base">{weather ? `${weather?.windSpeed} km/h` : ''}</p>
            </div>
            {isMapRoute ? (
              <>
                <LucideEllipsisVertical className="mt-4" aria-hidden="true" />
                <button
                  type="button"
                  aria-label="Ouvrir les filtres"
                  onClick={togglePanel}
                  className="toggle-filter-panel focus-visible:ring-wander-orange mt-4 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <SlidersHorizontal className="h-8 w-auto" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
};
export default Header;
