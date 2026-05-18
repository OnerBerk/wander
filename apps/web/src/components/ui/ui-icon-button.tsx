interface UIIconButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  icon: string;
  label: string;
}

const UIIconButton: React.FC<UIIconButtonProps> = ({ isVisible, onToggle, icon, label }) => {
  return (
    <button
      type="button"
      aria-pressed={isVisible}
      aria-label={isVisible ? `Masquer ${label}` : `Afficher ${label}`}
      onClick={onToggle}
      className="focus-visible:ring-wander-orange relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:h-12 md:w-12"
    >
      <img
        src={icon}
        alt=""
        className={`h-10 w-10 object-contain transition md:h-12 md:w-12 ${isVisible ? '' : 'opacity-40 grayscale'}`}
      />
      {!isVisible && <span className="absolute h-0.5 w-8 rotate-45 rounded-full bg-slate-700 md:w-10" />}
    </button>
  );
};

export default UIIconButton;
