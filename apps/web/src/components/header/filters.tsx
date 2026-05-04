import {useForm} from 'react-hook-form';
import useFilterStore from '@/store/zustand/useFilterStore';
import {EventPeriod} from '@wander/types';

interface FormData {
  period: EventPeriod;
}

const Filters: React.FC<{handleClose: () => void}> = ({handleClose}) => {
  const eventPeriod = useFilterStore((state) => state.eventPeriod);
  const setEventPeriod = useFilterStore((state) => state.setEventPeriod);

  const {register, handleSubmit} = useForm<FormData>({
    defaultValues: {
      period: eventPeriod,
    },
  });

  const onSubmit = (data: FormData) => {
    setEventPeriod(data.period);
    handleClose();
  };

  return (
    <div className='flex items-center gap-2'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-center gap-2'>
          <select
            className=' rounded-l-md border border-white/30 bg-white/20 px-3 py-1 text-sm'
            {...register('period')}>
            <option value='today'>Aujourd'hui</option>
            <option value='week'>Cette semaine</option>
            <option value='month'>Ce mois-ci</option>
            <option value='all'>Tout</option>
          </select>
          <button
            type='submit'
            className=' bg-wander-orange text-white cursor-pointer rounded-full border border-white/30 px-3 py-1 text-sm'>
            go
          </button>
        </div>
      </form>
    </div>
  );
};

export default Filters;
