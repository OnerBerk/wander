import React from 'react';

interface FilterBadgeProps {
  label: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({
  label,
  icon,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  ariaLabel,
}) => {
  const interactive = Boolean(onClick) && !disabled;
  const dim = !selected && !disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-pressed={interactive ? selected : undefined}
      aria-label={ariaLabel ?? label}
      style={{ opacity: disabled ? 0.6 : 1 }}
      className={`relative flex aspect-square w-full flex-col items-center justify-center overflow-visible select-none focus:outline-none ${interactive ? 'cursor-pointer' : 'cursor-default'} disabled:cursor-not-allowed ${className}`}
    >
      <div
        style={{ filter: disabled ? 'grayscale(1) blur(1px)' : undefined }}
        className="flex h-[78%] w-[78%] items-center justify-center"
      >
        {icon ? (
          <img
            src={icon}
            alt=""
            width={80}
            height={80}
            className={`h-full w-auto object-contain ${dim ? 'brightness-[.6]' : ''}`}
          />
        ) : (
          <span className="px-1 text-center text-xs font-semibold text-white">{label}</span>
        )}
      </div>

      {icon && (
        <div
          className={`borderpx-1 z-10 flex h-5 w-full shrink-0 items-center justify-center rounded-md ${dim ? 'opacity-70' : ''}`}
        >
          <span className="text-wander-text-white w-full truncate text-center text-[12px] leading-none font-semibold">
            {label}
          </span>
        </div>
      )}
    </button>
  );
};

export default FilterBadge;
