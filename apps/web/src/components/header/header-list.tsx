//import { useWeather } from '@/api/features/weather/queries/use-weather';
import wanderLogoPaper from '@/assets/logo/wander-logo-paper.webp';

import { useWeatherIcon } from '@/hooks/useWeatherIcon';
import bgCreme from '@/assets/bg/bg-crem.webp';

const HeaderList = () => {
  // const { data: weather } = useWeather();
  const icon = useWeatherIcon();

  return (
    <header className={`relative hidden shrink-0 md:block`} style={{ backgroundImage: `url(${bgCreme})` }}>
      <div className="font-alternate flex justify-between">
        <div className="w-full">
          <div className="flex items-center">
            <img className="h-25" src={wanderLogoPaper} alt="Wander" width={200} height={200} />
            <div className="hidden flex-col items-center md:block">
              <p className="text-wander-orange text-3xl font-semibold md:text-5xl">Wander</p>
              <p className="text-xs font-medium md:text-base">Explorer votre ville autrement</p>
            </div>
          </div>
          <h1
            className="bg-cover bg-clip-text bg-center pl-3 text-5xl leading-none font-bold text-transparent md:text-6xl lg:-mb-10 lg:text-[130px] xl:-mb-12 xl:text-[200px]"
            style={{ backgroundImage: 'url(/bg-marine.webp)' }}
          >
            Événements
          </h1>
        </div>

        <div className="absolute top-2 right-4 flex flex-col items-center">
          {icon && <img className="h-60 w-auto max-w-none object-contain" src={icon.src} alt={icon.alt} />}
        </div>
      </div>
    </header>
  );
};
export default HeaderList;
