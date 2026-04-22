import {Coordinates} from './coordinates.types';
import {PriceType} from './price.types';

export interface EventData {
  id: string;
  title: string;
  leadText: string;
  dateStart: string;
  dateEnd: string;
  occurrences: string | null;
  location: Coordinates;
  coverUrl: string | null;
  coverAlt: string | null;
  priceType: PriceType | null;
  priceDetail: string | null;
  tags: string[];
  url: string;
  addressName: string;
  addressStreet: string;
  addressZipcode: string;
  addressCity: string;
  audience: string | null;
  isIndoor: boolean;
  petsAllowed: boolean;
  contactUrl: string | null;
  contactPhone: string | null;
  accessType: string | null;
  accessLink: string | null;
}
