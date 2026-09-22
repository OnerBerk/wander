import { EventData } from './event.types';

export interface ChatResult {
  message: string;
  events: EventData[];
}
