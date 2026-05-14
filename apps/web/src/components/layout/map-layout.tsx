import { Outlet } from 'react-router-dom';
import EventModal from '@/components/modals/event-modal';
import FilterPanel from '@/components/panel/filter-panel';
import FilterPanelMobile from '@/components/panel/filter-panel-mobile';
import MetroStationModal from '@/components/modals/metro-station-modal';
import VelibModal from '@/components/modals/velib-modal';
import WeatherMobile from '@/components/weather/weather-mobile';
import useMarkerStore from '@/store/zustand/useMarkerStore';

const MapLayout = () => {
  const detailModal = useMarkerStore((state) => state.detailModal);

  return (
    <main className="relative min-h-0 flex-1 overflow-hidden">
      {detailModal.type === 'event' && <EventModal event={detailModal.data} />}
      {detailModal.type === 'bike' && <VelibModal station={detailModal.data} />}
      {detailModal.type === 'metro' && <MetroStationModal station={detailModal.data} />}
      <FilterPanel />
      <Outlet />
      <WeatherMobile />
      <FilterPanelMobile />
    </main>
  );
};

export default MapLayout;
