import { EventData, VelibStation } from '@wander/types';
import { create } from 'zustand';
import { MetroStation } from '@/types/metro-station';

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

type MetroMarkerDetail = {
  type: 'metro';
  isOpen: true;
  data: MetroStation;
};

type InvadersMarkerDetail = {
  type: 'invaders';
  isOpen: true;
  data: undefined;
};
export type MarkerDetail =
  | ClosedMarkerDetail
  | EventMarkerDetail
  | BikeMarkerDetail
  | MetroMarkerDetail
  | InvadersMarkerDetail;

interface MarkerStore {
  detailModal: MarkerDetail;
  openEventDetail: (data: EventData) => void;
  openBikeDetail: (data: VelibStation) => void;
  openMetroDetail: (data: MetroStation) => void;
  openInvadersDetail: () => void;
  closeDetailModal: () => void;
}

const CLOSED_MARKER_DETAIL: ClosedMarkerDetail = {
  type: undefined,
  isOpen: false,
  data: undefined,
};

const useMarkerStore = create<MarkerStore>()((set) => ({
  detailModal: CLOSED_MARKER_DETAIL,
  openEventDetail: (data) => set({ detailModal: { type: 'event', isOpen: true, data } }),
  openBikeDetail: (data) => set({ detailModal: { type: 'bike', isOpen: true, data } }),
  openMetroDetail: (data) => set({ detailModal: { type: 'metro', isOpen: true, data } }),
  openInvadersDetail: () => set({ detailModal: { type: 'invaders', isOpen: true, data: undefined } }),
  closeDetailModal: () => set({ detailModal: CLOSED_MARKER_DETAIL }),
}));

export default useMarkerStore;
