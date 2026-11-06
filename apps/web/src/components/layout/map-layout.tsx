import FilterPanel from '@/components/panel/filter-panel';
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
    </main>
  );
};

export default MapLayout;
