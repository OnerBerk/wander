import FilterPanel from '@/components/panel/filter-panel';
import FilterPanelMobile from '@/components/panel/filter-panel-mobile';
import WeatherMobile from '@/components/weather/weather-mobile';
import WebGenericDescriptionModal from '../modals/web-generic-description-modal';

const MapLayout = () => {
  return (
    <main className="pointer-events-none relative h-full w-full overflow-hidden">
      <div className="pointer-events-auto">
        <FilterPanel />
      </div>
      <div className="pointer-events-auto">
        <WebGenericDescriptionModal />
      </div>
      <div className="pointer-events-auto">
        <WeatherMobile />
      </div>
      <div className="pointer-events-auto">
        <FilterPanelMobile />
      </div>
    </main>
  );
};

export default MapLayout;
