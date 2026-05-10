import {Outlet} from 'react-router-dom';
import Header from '../header/header';
import useMarkerStore from '@/store/zustand/useMarkerStore';
import EventModal from '@/components/modals/event-modal';
import VelibModal from '@/components/modals/velib-modal';
import MetroStationModal from '@/components/modals/metro-station-modal';
import FilterPanel from '../panel/filter-panel';

const Layout = () => {
  const detailModal = useMarkerStore((state) => state.detailModal);

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <Header />
      <main className='relative min-h-0 flex-1 overflow-hidden'>
        {detailModal.type === 'event' && <EventModal event={detailModal.data} />}
        {detailModal.type === 'bike' && <VelibModal station={detailModal.data} />}
        {detailModal.type === 'metro' && <MetroStationModal station={detailModal.data} />}
        <FilterPanel />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
