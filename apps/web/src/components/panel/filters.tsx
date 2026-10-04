import { useEventFilters } from '@/hooks/use-event-filters';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import NoMarker from '@/assets/markers/no-marker.webp';
import AllMarker from '@/assets/markers/all-marker.webp';
import FilterBadge from '@/ui-components/filter-badge';
import PeriodSelect from '@/ui-components/period-select';

const Filters: React.FC = () => {
  const { period, tags, all, none, handlePeriodChange, toggleTag, handleAll, handleNone } = useEventFilters();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="tag-filters flex flex-col gap-4 p-3 text-xs md:text-sm">
        <div className="grid grid-cols-5 items-center gap-2">
          <FilterBadge label="Tout" selected={all} onClick={handleAll} className="max-w-20" icon={AllMarker} />
          <FilterBadge label="Aucun" selected={none} onClick={handleNone} className="max-w-20" icon={NoMarker} />
          <PeriodSelect value={period} onChange={handlePeriodChange} />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {EVENT_TAG_OPTIONS.map(({ value, label, icon }) => (
            <FilterBadge
              key={value}
              className="max-w-25"
              label={label}
              icon={icon}
              selected={tags.includes(value)}
              onClick={() => toggleTag(value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
