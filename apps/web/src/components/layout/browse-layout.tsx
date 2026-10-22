import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import ViewSwitch from '@/ui-components/view-switch';
import { loadMapPage } from '@/pages/load-map-page';
import usePanelStore from '@/store/zustand/usePanelStore';
import paneOpen from '@/assets/icons/pane-open.svg';
import paneClose from '@/assets/icons/pane-close.svg';

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
  const togglePanel = usePanelStore((state) => state.togglePanel);
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
      <div
        className={`bg-wander-orange/30 pointer-events-auto fixed z-70 flex w-fit items-center gap-2 rounded-2xl px-2 py-1 md:px-4 md:py-2 ${
          isMap ? 'right-4 bottom-4 md:top-37 md:right-auto md:bottom-auto md:left-5' : 'top-37 left-5'
        }`}
      >
        <ViewSwitch />
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
      </div>
    </div>
  );
};

export default BrowseLayout;
