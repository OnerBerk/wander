import {lazy, Suspense} from 'react';
import {Outlet} from 'react-router-dom';
import Header from '../header/header';
import useMarkerStore from '@/store/zustand/useMarkerStore';
import EventModal from '@/components/modals/event-modal';
import VelibModal from '@/components/modals/velib-modal';

const MetroStationModal = lazy(() => import('@/components/modals/metro-station-modal'));

const Layout = () => {
  const detailModal = useMarkerStore((state) => state.detailModal);

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <Header />
      <main className='relative min-h-0 flex-1'>
        {detailModal.type === 'event' && <EventModal event={detailModal.data} />}
        {detailModal.type === 'bike' && <VelibModal station={detailModal.data} />}
        {detailModal.type === 'metro' && (
          <Suspense fallback={null}>
            <MetroStationModal station={detailModal.data} />
          </Suspense>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
