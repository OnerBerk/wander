import { useEffect, useId, useState } from 'react';
import usePanelStore from '@/store/zustand/usePanelStore';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterBadge from '@/ui-components/filter-badge';
import { useMapLayerFilters } from '@/hooks/use-map-layer-filters';
import Filters from './filters';

const FilterPanelMobile = () => {
  const titleId = useId();
  const togglePanel = usePanelStore((state) => state.togglePanel);
  const isPanelOpen = usePanelStore((state) => state.isPanelOpen);

  const mapLayers = useMapLayerFilters();

  const [phase, setPhase] = useState<'closed' | 'bubble' | 'expanded'>('closed');

  useEffect(() => {
    if (isPanelOpen) {
      setPhase('bubble');
      const t = setTimeout(() => setPhase('expanded'), 700);
      return () => clearTimeout(t);
    } else {
      setPhase('bubble');
      const t = setTimeout(() => setPhase('closed'), 500);
      return () => clearTimeout(t);
    }
  }, [isPanelOpen]);

  const panelStyle = {
    closed: {
      left: '40px',
      bottom: '16px',
      width: '44px',
      height: '44px',
      borderRadius: '9999px',
      opacity: 0,
      transform: 'translateX(-50%) scale(0.3)',
      backgroundColor: '#f97316',
      backdropFilter: 'blur(0px)',
    },
    bubble: {
      left: '40px',
      bottom: '80px',
      width: '44px',
      height: '44px',
      borderRadius: '9999px',
      opacity: 1,
      transform: 'translateX(-50%) scale(1)',
      backgroundColor: '#f97316',
      backdropFilter: 'blur(0px)',
    },
    expanded: {
      left: '16px',
      bottom: '5px',
      width: 'calc(100vw - 32px)',
      height: 'calc(100dvh - 25px)',
      borderRadius: '24px',
      opacity: 1,
      transform: 'translateX(0) scale(1)',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(12px)',
    },
  }[phase];

  return (
    <div
      role={isPanelOpen ? 'dialog' : undefined}
      aria-modal={isPanelOpen ? 'true' : undefined}
      aria-labelledby={isPanelOpen ? titleId : undefined}
      className="md:hidden"
    >
      <div
        style={{
          zIndex: 95,
          position: 'fixed',
          ...panelStyle,
          WebkitBackdropFilter: panelStyle.backdropFilter,
          pointerEvents: phase === 'expanded' ? 'auto' : 'none',
          transition: 'all 600ms cubic-bezier(0.34, 1.4, 0.64, 1)',
          transformOrigin: 'bottom left',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: 'white',
            opacity: phase === 'bubble' ? 1 : 0,
            transition: 'opacity 200ms ease-out',
            transitionDelay: phase === 'bubble' ? '200ms' : '0ms',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            transition: 'opacity 250ms',
            transitionDelay: phase === 'expanded' ? '300ms' : '0ms',
            opacity: phase === 'expanded' ? 1 : 0,
          }}
          className="p-6"
        >
          <h2 id={titleId} className="sr-only">
            Filtres
          </h2>
          <div className="filter-panel-mobile grid w-full grid-cols-4 gap-2 border-b border-white/20 pb-4">
            {mapLayers.map((layer) => (
              <FilterBadge
                key={layer.label}
                label={layer.label}
                icon={layer.icon}
                selected={layer.selected}
                onClick={layer.onClick}
                ariaLabel={layer.ariaLabel}
                className="max-w-24"
              />
            ))}
          </div>
          <div className="mobile-filters">
            <Filters />
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={isPanelOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
        onClick={togglePanel}
        style={{ zIndex: 100 }}
        className="toggle-filter-panel-mobile bg-wander-orange/40 focus-visible:ring-wander-orange fixed bottom-4 left-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 shadow-lg backdrop-blur-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {isPanelOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <SlidersHorizontal className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default FilterPanelMobile;
