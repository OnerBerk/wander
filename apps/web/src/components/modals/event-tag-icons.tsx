import { EventTag } from '@wander/types';
import { getUniqueEventTagIcons } from '@/constants/event-tag-options';

interface EventTagIconsProps {
  tags: readonly EventTag[];
  className?: string;
  iconClassName?: string;
}

const DEFAULT_ICON_CLASS_NAME = 'h-7 w-7 object-contain md:h-8 md:w-8';

const EventTagIcons: React.FC<EventTagIconsProps> = ({
  tags,
  className = '',
  iconClassName = DEFAULT_ICON_CLASS_NAME,
}) => {
  const icons = getUniqueEventTagIcons(tags);

  if (icons.length === 0) {
    return null;
  }

  return (
    <ul className={`flex list-none flex-wrap items-center gap-2 p-0 ${className}`.trim()} aria-label="Catégories">
      {icons.map(({ icon, label }) => (
        <li key={icon}>
          <img src={icon} alt={label} title={label} className={iconClassName} />
        </li>
      ))}
    </ul>
  );
};

export default EventTagIcons;
