import { Outlet } from 'react-router-dom';
import FilterPanel from '@/components/panel/filter-panel';
import FilterPanelMobile from '@/components/panel/filter-panel-mobile';
import WeatherMobile from '@/components/weather/weather-mobile';
import WebGenericDescriptionModal from '../modals/web-generic-description-modal';

const MapLayout = () => {
  return (
    <main className="relative min-h-0 flex-1 overflow-hidden">
      <FilterPanel />
      <Outlet />
      <WebGenericDescriptionModal />
      <WeatherMobile />
      <FilterPanelMobile />
    </main>
  );
};

export default MapLayout;
