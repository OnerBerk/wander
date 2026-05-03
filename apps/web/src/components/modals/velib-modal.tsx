import {VelibStation} from '@wander/types';
import {markerModalBaseClassName} from '@/components/modals/modal-styles';

interface VelibModalProps {
  station: VelibStation;
}

const VelibModal: React.FC<VelibModalProps> = ({station}) => {
  return (
    <div className={`${markerModalBaseClassName} w-[min(85vw,250px)] md:max-w-[250px]`}>
      <h1 className='text-lg font-semibold md:text-xl'>{station.name}</h1>
      <p className='text-xs md:text-sm'>Vélos disponibles : {station.bikesAvailable}</p>
      <p className='text-xs md:text-sm'>Places disponibles : {station.docksAvailable}</p>
      <p className='text-xs md:text-sm'>Vélos mécaniques : {station.mechanical}</p>
      <p className='text-xs md:text-sm'>Vélos électriques : {station.ebike}</p>
    </div>
  );
};

export default VelibModal;
