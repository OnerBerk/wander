import {EventData} from '@wander/types';
import {markerModalBaseClassName} from '@/components/modals/modal-styles';
import {DateTime} from 'luxon';

interface EventModalProps {
  event: EventData;
}

const EventModal: React.FC<EventModalProps> = ({event}) => {
  console.log(event);
  return (
    <div className={`${markerModalBaseClassName} min-w-[300px] max-w-[700px]`}>
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl font-semibold'>{event.title}</h1>
        <p className='text-sm'>{DateTime.fromISO(event.dateStart).toLocaleString(DateTime.DATE_MED)}</p>
        <p className='text-sm'>{event.leadText}</p>
        <p className='text-sm'>{event.addressName}</p>
        <p className='text-sm'>
          {event.addressStreet}, {event.addressZipcode} {event.addressCity}
        </p>
      </div>
      {event.coverUrl && <img src={event.coverUrl} alt={event.coverAlt ?? ''} className='w-full h-auto' />}
    </div>
  );
};

export default EventModal;
