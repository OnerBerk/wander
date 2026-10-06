import { useState } from 'react';
import AllMarker from '@/assets/markers/all-marker.webp';
import NoMarker from '@/assets/markers/no-marker.webp';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import { useEventFilters } from '@/hooks/use-event-filters';
import FilterBadge from '@/ui-components/filter-badge';
import PeriodSelect from '@/ui-components/period-select';
import { ChevronDown } from 'lucide-react';

const FilterPanelList = () => {
  const { period, tags, all, none, handlePeriodChange, toggleTag, handleAll, handleNone } = useEventFilters();
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-250">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 py-2 text-sm font-medium text-white"
      >
        Filtres
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className={open ? 'overflow-visible' : 'overflow-hidden'}>
          <div className="flex flex-wrap items-center justify-center gap-0 pb-3 sm:justify-start sm:gap-2.5">
            <div className="w-15 shrink-0 sm:w-18">
              <FilterBadge label="Tout" icon={AllMarker} selected={all} onClick={handleAll} />
            </div>
            <div className="w-15 shrink-0 sm:w-18">
              <FilterBadge label="Aucun" icon={NoMarker} selected={none} onClick={handleNone} />
            </div>
            {EVENT_TAG_OPTIONS.map(({ value, label, icon }) => (
              <div key={value} className="w-15 shrink-0 sm:w-18">
                <FilterBadge
                  label={label}
                  icon={icon}
                  selected={tags.includes(value)}
                  onClick={() => toggleTag(value)}
                />
              </div>
            ))}
            <PeriodSelect
              value={period}
              onChange={handlePeriodChange}
              chipColorClassName="border-white text-white"
              chipBackgroundStyle={{ backgroundImage: 'url(/bg-marine.webp)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelList;
