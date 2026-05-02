import {EventData, VelibStation} from '@wander/types';
import {create} from 'zustand';

type ClosedMarkerDetail = {
  type: undefined;
  isOpen: false;
  data: undefined;
};

type EventMarkerDetail = {
  type: 'event';
  isOpen: true;
  data: EventData;
};

type BikeMarkerDetail = {
  type: 'bike';
  isOpen: true;
  data: VelibStation;
};

export type MarkerDetail = ClosedMarkerDetail | EventMarkerDetail | BikeMarkerDetail;

interface MarkerStore {
  detailModal: MarkerDetail;
  openEventDetail: (data: EventData) => void;
  openBikeDetail: (data: VelibStation) => void;
  closeDetailModal: () => void;
}

const CLOSED_MARKER_DETAIL: ClosedMarkerDetail = {
  type: undefined,
  isOpen: false,
  data: undefined,
};

const useMarkerStore = create<MarkerStore>()((set) => ({
  detailModal: CLOSED_MARKER_DETAIL,
  openEventDetail: (data) => set({detailModal: {type: 'event', isOpen: true, data}}),
  openBikeDetail: (data) => set({detailModal: {type: 'bike', isOpen: true, data}}),
  closeDetailModal: () => set({detailModal: CLOSED_MARKER_DETAIL}),
}));

export default useMarkerStore;
