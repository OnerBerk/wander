import React from 'react';

const HEX_PTS = '28,6 72,6 94,50 72,94 28,94 6,50';
const HEX_CLIP = 'polygon(28% 6%, 72% 6%, 94% 50%, 72% 94%, 28% 94%, 6% 50%)';
const BORDER = '#002543';

interface HexagonBadgeProps {
  label: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

const HexagonBadge: React.FC<HexagonBadgeProps> = ({
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
      className={`relative aspect-square w-full overflow-visible select-none focus:outline-none ${interactive ? 'cursor-pointer' : 'cursor-default'} disabled:cursor-not-allowed ${className}`}
    >
      <div
        style={{ clipPath: HEX_CLIP, filter: disabled ? 'grayscale(1) blur(1px)' : undefined }}
        className="absolute inset-0 flex items-center justify-center bg-slate-500/50"
      >
        {icon ? (
          <img src={icon} alt="" className={`h-[75%] w-auto object-contain ${dim ? 'brightness-[.6]' : ''}`} />
        ) : (
          <span className="px-1 text-center text-xs font-semibold text-white">{label}</span>
        )}
      </div>

      {icon && (
        <div
          className={`absolute top-[62%] left-1/2 z-10 flex h-5 w-[104%] -translate-x-1/2 items-center justify-center rounded-md border border-white/25 bg-black/80 px-1 ${dim ? 'opacity-70' : ''}`}
        >
          <span className="w-full truncate text-center text-[12px] leading-none font-semibold text-white">{label}</span>
        </div>
      )}

      <svg
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.45))' }}
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <polygon points={HEX_PTS} fill="none" stroke={BORDER} strokeWidth="8" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default HexagonBadge;
