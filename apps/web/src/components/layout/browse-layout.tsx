import { lazy, Suspense, useEffect, useState } from 'react';
import { CloudSun, SlidersHorizontal, X } from 'lucide-react';
import { Outlet, useMatch } from 'react-router-dom';
import ViewSwitch from '@/ui-components/view-switch';
import { loadMapPage } from '@/pages/load-map-page';
import usePanelStore from '@/store/zustand/usePanelStore';
import paneOpen from '@/assets/icons/pane-open.svg';
import paneClose from '@/assets/icons/pane-close.svg';
import WeatherMobile from '@/components/weather/weather-mobile';
import FilterPanelMobile from '@/components/panel/filter-panel-mobile';
import AiPanel from '@/components/panel/ai-panel/ai-panel';
import iaIcon from '@/assets/icons/IA-icon.png';

const LazyMapPage = lazy(loadMapPage);

const scheduleMapPreload = (load: () => void): (() => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    const idleId = window.requestIdleCallback(load);
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(load, 200);
  return () => window.clearTimeout(timeoutId);
};

const BrowseLayout = () => {
  const isMap = Boolean(useMatch({ path: '/map', end: true }));
  const isPanelOpen = usePanelStore((state) => state.isPanelOpen);
  const isWeatherOpen = usePanelStore((state) => state.isWeatherPanelOpen);
  const isAiPanelOpen = usePanelStore((state) => state.isAiPanelOpen);
  const togglePanel = usePanelStore((state) => state.togglePanel);
  const toggleWeatherPanel = usePanelStore((state) => state.toggleWeatherPanel);
  const toggleAiPanel = usePanelStore((state) => state.toggleAiPanel);
  const [hasShownMap, setHasShownMap] = useState(isMap);
  const showMap = isMap || hasShownMap;

  useEffect(() => {
    if (isMap) setHasShownMap(true);
  }, [isMap]);

  useEffect(() => {
    if (showMap) return;
    return scheduleMapPreload(() => {
      void loadMapPage();
    });
  }, [showMap]);

  return (
    <div className="relative min-h-0 flex-1">
      {showMap && (
        <div className={`absolute inset-0 ${isMap ? '' : 'pointer-events-none invisible'}`} aria-hidden={!isMap}>
          <Suspense
            fallback={
              <div className="bg-wander-crem absolute inset-0 flex items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              </div>
            }
          >
            <LazyMapPage />
          </Suspense>
        </div>
      )}
      <div
        className={isMap ? 'pointer-events-none absolute inset-0 z-10' : 'relative z-10 flex h-full min-h-0 flex-col'}
      >
        <Outlet />
      </div>
      <div className="bg-wander-crem/90 pointer-events-auto fixed top-21 left-5 z-100 flex w-fit items-center gap-2 rounded-2xl px-2 py-1 md:top-37 md:z-70 md:px-4 md:py-2">
        <ViewSwitch />
        <button
          type="button"
          aria-label={isWeatherOpen ? 'Fermer la météo' : 'Ouvrir la météo'}
          onClick={toggleWeatherPanel}
          className="weather-mobile-toggle flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-100/60 bg-sky-200/60 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
        >
          {isWeatherOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <CloudSun className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          aria-label={isPanelOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
          onClick={togglePanel}
          className="toggle-filter-panel-mobile bg-wander-orange/40 focus-visible:ring-wander-orange flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
        >
          {isPanelOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        {isMap && (
          <button
            type="button"
            aria-label={isPanelOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
            onClick={togglePanel}
            className="toggle-filter-panel hidden cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:block"
          >
            <img src={isPanelOpen ? paneClose : paneOpen} alt="" className="h-11 w-11" />
          </button>
        )}
        <button
          type="button"
          aria-label={isAiPanelOpen ? 'Fermer l’assistant' : 'Ouvrir l’assistant'}
          aria-expanded={isAiPanelOpen}
          onClick={toggleAiPanel}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:h-11 md:w-11"
        >
          <img data-colibri-cible src={iaIcon} alt="" className="h-full w-full object-contain" />
        </button>
      </div>
      <WeatherMobile />
      <FilterPanelMobile />
      <AiPanel />
    </div>
  );
};

export default BrowseLayout;
