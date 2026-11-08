import wanderLogoPaper from '@/assets/logo/wander-logo-paper.png';

import { useIsDay } from '@/hooks/useIsDay';

import { useWeatherIcon } from '@/hooks/useWeatherIcon';

const Header = () => {
  const icon = useWeatherIcon();
  const isDay = useIsDay();

  return (
    <header
      className={`relative z-60 block h-16 shrink-0 p-[0.35rem] md:h-32 md:p-2 ${isDay ? 'header-day' : 'header-night'}`}
    >
      <div className="font-alternate flex h-full justify-between">
        <div className="flex h-full items-center gap-[0.525rem] md:gap-3">
          <img className="h-14 w-auto object-contain md:h-20" src={wanderLogoPaper} alt="Wander" />
          <div className="block flex-col items-center">
            <p className="text-wander-orange text-[1.3125rem] font-semibold md:text-5xl">Wander</p>
            <p className="text-[0.525rem] font-medium md:text-2xl">Explorer votre ville autrement</p>
          </div>
        </div>
        <div className="group relative hidden h-full items-start md:flex">
          {icon && (
            <>
              <p
                className={`bg-wander-crem/15 text-wander-text pointer-events-none absolute top-1/2 right-full z-0 hidden w-200 translate-x-12 -translate-y-1/2 overflow-hidden text-2xl font-medium group-hover:block`}
              >
                <span className="animate-weather-marquee inline-block whitespace-nowrap">{icon.line}</span>
              </p>
              <img
                className="weather-icon relative z-10 mr-[0.35rem] h-[7.875rem] w-auto shrink-0 object-contain md:mr-2 md:h-45"
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
