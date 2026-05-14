import { X } from 'lucide-react';

interface UIClosePanelButtonProps {
  ariaLabel: string;
  onClose: () => void;
  className?: string;
}

const UIClosePanelButton: React.FC<UIClosePanelButtonProps> = ({ ariaLabel, onClose, className = '' }) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClose}
      className={`text-wander-text focus-visible:ring-wander-orange absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
    >
      <X className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export default UIClosePanelButton;
