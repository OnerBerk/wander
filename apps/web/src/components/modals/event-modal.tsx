import {EventData} from '@wander/types';
import {markerModalBaseClassName} from '@/components/modals/modal-styles';
import {DateTime} from 'luxon';

interface EventModalProps {
  event: EventData;
}

const EventModal: React.FC<EventModalProps> = ({event}) => {
  return (
    <div className={`${markerModalBaseClassName} w-[min(90vw,560px)] md:min-w-[300px] md:max-w-[700px]`}>
      <div className='flex flex-col gap-2'>
        <h1 className='text-lg font-semibold md:text-xl'>{event.title}</h1>
        <p className='text-xs md:text-sm'>{DateTime.fromISO(event.dateStart).toLocaleString(DateTime.DATE_MED)}</p>
        <p className='text-xs md:text-sm'>{event.leadText}</p>
        <p className='text-xs md:text-sm'>{event.addressName}</p>
        <p className='text-xs md:text-sm'>
          {event.addressStreet}, {event.addressZipcode} {event.addressCity}
        </p>
      </div>
      {event.coverUrl && (
        <img src={event.coverUrl} alt={event.coverAlt ?? ''} className='max-h-36 w-full rounded-lg object-cover md:max-h-none md:rounded-none' />
      )}
    </div>
  );
};

export default EventModal;
