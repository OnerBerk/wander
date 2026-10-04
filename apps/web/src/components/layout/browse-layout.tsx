import MapPage from '@/pages/map-pages';
import ViewSwitch from '@/ui-components/view-switch';
import { Outlet, useMatch } from 'react-router-dom';

const BrowseLayout = () => {
  const isMap = Boolean(useMatch({ path: '/map', end: true }));

  return (
    <div className="relative min-h-0 flex-1">
      <div className={`absolute inset-0 ${isMap ? '' : 'pointer-events-none invisible'}`} aria-hidden={!isMap}>
        <MapPage />
      </div>
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
