import wanderLogoPaper from '@/assets/logo/wander-logo-paper.png';
import { useMatch } from 'react-router-dom';

import { useIsDay } from '@/hooks/useIsDay';

import { useWeatherIcon } from '@/hooks/useWeatherIcon';

const Header = () => {
  const icon = useWeatherIcon();
  const isDay = useIsDay();
  const isMap = Boolean(useMatch({ path: '/map', end: true }));

  return (
    <header className={`relative z-60 block h-32 shrink-0 p-2 ${isDay ? 'header-day' : 'header-night'}`}>
      <div className="font-alternate flex h-full justify-between">
        <div className="flex h-full items-center gap-3">
          <img className="h-20 w-auto object-contain" src={wanderLogoPaper} alt="Wander" />
          <div className="block flex-col items-center">
            <p className="text-wander-orange text-3xl font-semibold md:text-5xl">Wander</p>
            <p className="text-xs font-medium md:text-2xl">Explorer votre ville autrement</p>
          </div>
        </div>
        <div className={`group relative h-full items-start ${isMap ? 'hidden md:flex' : 'flex'}`}>
          {icon && (
            <>
              <p
                className={`bg-wander-crem/15 text-wander-text pointer-events-none absolute top-1/2 right-full z-0 hidden w-200 translate-x-12 -translate-y-1/2 overflow-hidden text-2xl font-medium group-hover:block`}
              >
                <span className="animate-weather-marquee inline-block whitespace-nowrap">{icon.line}</span>
              </p>
              <img
                data-colibri-cible
                className="weather-icon relative z-10 mr-2 h-45 w-auto shrink-0 object-contain"
                src={icon.src}
                alt={icon.alt}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
