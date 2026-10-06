import { PERIOD_OPTIONS } from '@/hooks/use-event-filters';
import { EventPeriod } from '@wander/types';
import { Calendar } from 'lucide-react';
import { CSSProperties, useState } from 'react';

interface PeriodSelectProps {
  value: EventPeriod;
  onChange: (period: EventPeriod) => void;
  chipColorClassName?: string;
  chipBackgroundStyle?: CSSProperties;
}

const PeriodSelect = ({
  value,
  onChange,
  chipColorClassName = 'border-slate-900 text-slate-900',
  chipBackgroundStyle,
}: PeriodSelectProps) => {
  const [open, setOpen] = useState(false);

  const choose = (period: EventPeriod) => {
    onChange(period);
    setOpen(false);
  };

  return (
    <div
      className="relative w-fit"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Période"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex w-18 shrink-0 cursor-pointer flex-col items-center gap-2"
      >
        <span
          style={chipBackgroundStyle}
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-cover bg-center sm:h-13 sm:w-13 ${chipColorClassName}`}
        >
          <Calendar className="h-6 w-6" aria-hidden="true" />
        </span>
        <span className={`w-full truncate text-center text-[12px] leading-none font-semibold ${chipColorClassName}`}>
          Période
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Période"
          className="text-wander-text absolute top-full left-0 z-50 mt-1 min-w-40 rounded-xl bg-white py-1 text-sm shadow-lg"
        >
          {PERIOD_OPTIONS.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(option.value)}
                  className={`w-full cursor-pointer px-3 py-1.5 text-left hover:bg-slate-100 ${selected ? 'text-wander-orange font-semibold' : ''}`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PeriodSelect;
