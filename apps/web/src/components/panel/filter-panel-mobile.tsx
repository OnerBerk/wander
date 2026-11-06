import { useEffect, useId, useState } from 'react';
import { useMatch } from 'react-router-dom';
import AllMarker from '@/assets/markers/all-marker.webp';
import NoMarker from '@/assets/markers/no-marker.webp';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import { useEventFilters } from '@/hooks/use-event-filters';
import { useMapLayerFilters } from '@/hooks/use-map-layer-filters';
import usePanelStore from '@/store/zustand/usePanelStore';
import FilterBadge from '@/ui-components/filter-badge';
import PeriodSelect from '@/ui-components/period-select';

const FilterPanelMobile = () => {
  const titleId = useId();
  const isMap = Boolean(useMatch({ path: '/map', end: true }));
  const isPanelOpen = usePanelStore((state) => state.isPanelOpen);
  const { period, tags, all, none, handlePeriodChange, toggleTag, handleAll, handleNone } = useEventFilters();
  const mapLayers = useMapLayerFilters();
  const mobileLayers = ['Vélib', 'Métro', 'Invaders'].flatMap((label) => {
    const layer = mapLayers.find((item) => item.label === label);
    return layer ? [layer] : [];
  });

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
      top: '5.5rem',
      left: '154px',
      width: '44px',
      height: '44px',
      borderRadius: '9999px',
      opacity: 0,
      transform: 'translateX(-50%) scale(0.3)',
      backgroundColor: '#f97316',
      backdropFilter: 'blur(0px)',
    },
    bubble: {
      top: 'calc(5.5rem + 56px)',
      left: '154px',
      width: '44px',
      height: '44px',
      borderRadius: '9999px',
      opacity: 1,
      transform: 'translateX(-50%) scale(1)',
      backgroundColor: '#f97316',
      backdropFilter: 'blur(0px)',
    },
    expanded: {
      top: '8.25rem',
      left: '16px',
      width: 'calc(100vw - 32px)',
      height: 'calc(100dvh - 8.25rem - 16px)',
      borderRadius: '24px',
      opacity: 1,
      transform: 'translateX(0) scale(1)',
      backgroundImage: 'url(/bg-marine.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backdropFilter: 'blur(0px)',
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
          transformOrigin: 'top left',
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
          className="h-full overflow-y-auto p-4"
        >
          <h2 id={titleId} className="sr-only">
            Filtres
          </h2>
          <div className="grid grid-cols-4 items-start gap-3">
            {isMap
              ? mobileLayers.map((layer) => (
                  <FilterBadge
                    key={layer.label}
                    label={layer.label}
                    icon={layer.icon}
                    selected={layer.selected}
                    onClick={layer.onClick}
                    ariaLabel={layer.ariaLabel}
                    isDark
                  />
                ))
              : null}
            <FilterBadge
              className="col-start-1 [&_img]:scale-[0.8]"
              label="Aucun"
              icon={NoMarker}
              selected={none}
              onClick={handleNone}
              isDark
            />
            <FilterBadge
              className="[&_img]:scale-[0.8]"
              label="Tout"
              icon={AllMarker}
              selected={all}
              onClick={handleAll}
              isDark
            />
            <PeriodSelect
              badge
              value={period}
              onChange={handlePeriodChange}
              chipColorClassName="border-white text-white"
              chipBackgroundStyle={{ backgroundImage: 'url(/bg-marine.webp)' }}
            />
            {EVENT_TAG_OPTIONS.map(({ value, label, icon }, index) => (
              <FilterBadge
                key={value}
                className={index === 0 ? 'col-start-1' : ''}
                label={label}
                icon={icon}
                selected={tags.includes(value)}
                onClick={() => toggleTag(value)}
                isDark
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;
