import {Coordinates} from './coordinates.types';

export interface VelibStation {
  id: string;
  name: string;
  capacity: number;
  bikesAvailable: number;
  docksAvailable: number;
  mechanical: number;
  ebike: number;
  isRenting: boolean;
  isReturning: boolean;
  location: Coordinates;
}
