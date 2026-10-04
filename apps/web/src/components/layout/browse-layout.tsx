import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import ViewSwitch from '@/ui-components/view-switch';
import { loadMapPage } from '@/pages/load-map-page';

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
              <div className="absolute inset-0 flex items-center justify-center bg-[#e7e2d9]">
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
      <div className="pointer-events-auto fixed right-10 bottom-4 z-70">
        <ViewSwitch />
      </div>
    </div>
  );
};

export default BrowseLayout;
