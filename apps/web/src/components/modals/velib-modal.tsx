import {VelibStation} from '@wander/types';
import {markerModalBaseClassName} from '@/components/modals/modal-styles';

interface VelibModalProps {
  station: VelibStation;
}

const VelibModal: React.FC<VelibModalProps> = ({station}) => {
  return (
    <div className={`${markerModalBaseClassName} max-w-[250px]`}>
      <h1 className='text-xl font-semibold'>{station.name}</h1>
      <p className='text-sm'>Vélos disponibles : {station.bikesAvailable}</p>
      <p className='text-sm'>Places disponibles : {station.docksAvailable}</p>
      <p className='text-sm'>Vélos mécaniques : {station.mechanical}</p>
      <p className='text-sm'>Vélos électriques : {station.ebike}</p>
    </div>
  );
};

export default VelibModal;
