import {useState} from 'react';
import useFilterStore from '@/store/zustand/useFilterStore';
import {EventPeriod, EventTag} from '@wander/types';
import markerDefault from '@/assets/markers/marker-default.png';
import markerBook from '@/assets/markers/marker-book.png';
import markerMusic from '@/assets/markers/music-marker.png';
import markerTree from '@/assets/markers/marker-tree.png';

const CATEGORY_OPTIONS: Array<{value: EventTag; accent: string; icon: string}> = [
  {value: 'Art contemporain', accent: 'accent-rose-400', icon: markerDefault},
  {value: 'Conférence', accent: 'accent-sky-400', icon: markerDefault},
  {value: 'Concert', accent: 'accent-violet-400', icon: markerMusic},
  {value: 'Enfants', accent: 'accent-amber-400', icon: markerDefault},
  {value: 'Expo', accent: 'accent-cyan-500', icon: markerDefault},
  {value: 'Festival', accent: 'accent-fuchsia-400', icon: markerMusic},
  {value: 'Gourmand', accent: 'accent-orange-400', icon: markerDefault},
  {value: 'Histoire', accent: 'accent-lime-500', icon: markerDefault},
  {value: 'Littérature', accent: 'accent-yellow-600', icon: markerBook},
  {value: 'Loisirs', accent: 'accent-blue-400', icon: markerDefault},
  {value: 'Nature', accent: 'accent-green-400', icon: markerTree},
  {value: 'Spectacle musical', accent: 'accent-pink-400', icon: markerDefault},
  {value: 'Théâtre', accent: 'accent-red-400', icon: markerDefault},
];

interface FiltersProps {
  onSubmit?: () => void;
}

const Filters: React.FC<FiltersProps> = ({onSubmit}) => {
  const {eventPeriod, eventCategory, setEventPeriod, setEventCategory} = useFilterStore();

  const [period, setPeriod] = useState<EventPeriod>(eventPeriod);
  const [tags, setTags] = useState<EventTag[]>(eventCategory ?? []);
  const [all, setAll] = useState(!eventCategory?.length);
  const [error, setError] = useState(false);

  const toggleTag = (tag: EventTag) => {
    setError(false);
    setAll(false);
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleAll = () => {
    setAll(true);
    setTags([]);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!all && tags.length === 0) {
      setError(true);
      return;
    }
    setEventPeriod(period);
    setEventCategory(all ? undefined : tags);
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-2 w-full'>
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value as EventPeriod)}
        className='md:text-sm text-xs rounded-md border border-white/30 bg-white/40 px-3 py-1.5 text-sm focus:outline-none'>
        <option value='today'>Aujourd'hui</option>
        <option value='week'>Cette semaine</option>
        <option value='month'>Ce mois-ci</option>
        <option value='all'>Tout</option>
      </select>

      <div className='md:text-sm text-xs rounded-md border border-white/30 bg-white/20 p-3'>
        <label className='mb-3 flex cursor-pointer items-center gap-2 text-sm font-medium'>
          <input type='checkbox' checked={all} onChange={handleAll} className='h-4 w-4 accent-slate-700' />
          Tout
        </label>

        <div className='grid grid-cols-2 gap-2 md:flex md:flex-col md:gap-2'>
          {CATEGORY_OPTIONS.map(({value, accent, icon}) => (
            <label key={value} className='flex cursor-pointer items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={tags.includes(value)}
                onChange={() => toggleTag(value)}
                className={`h-4 w-4 ${accent}`}
              />
              <div className='flex items-center gap-2 justify-between w-full'>
                <span className='text-xs md:text-sm font-medium'>{value}</span>
                <img src={icon} alt='' className='h-7 w-7 md:h-9 md:w-9 object-contain' />
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && <p className='text-xs text-red-500'>Sélectionne au moins une catégorie ou coche "Tout".</p>}

      <button type='submit' className='cursor-pointer rounded-full bg-wander-orange px-4 py-1.5 text-sm text-white'>
        Appliquer
      </button>
    </form>
  );
};

export default Filters;
