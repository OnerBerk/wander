import { type TooltipRenderProps } from 'react-joyride';

const WanderTourTooltip = ({
  backProps,
  closeProps,
  continuous,
  index,
  isLastStep,
  primaryProps,
  size,
  step,
  tooltipProps,
}: TooltipRenderProps) => {
  return (
    <div {...tooltipProps} className="flex w-72 flex-col gap-2 rounded-2xl bg-white p-3 shadow-xl">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          {index + 1} / {size}
        </span>
        <button
          {...closeProps}
          className="text-gray-400 transition hover:text-gray-600 focus-visible:outline-none"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {step.title && <h3 className="text-wander-text mb-2 text-base font-semibold">{step.title}</h3>}
      <p className="text-wander-text text-sm leading-relaxed">{step.content}</p>

      <div className="flex items-center justify-end gap-2">
        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none"
            >
              Retour
            </button>
          )}
          {continuous && (
            <button
              {...primaryProps}
              className="bg-wander-orange rounded-full px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90 focus-visible:outline-none"
            >
              {isLastStep ? 'Terminer' : 'Suivant'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WanderTourTooltip;
