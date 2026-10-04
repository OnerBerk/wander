import subwayMarkerImageUrl from '@/assets/markers/subway/marker-subway.png';
import velibMarkerImageUrl from '@/assets/markers/bike/marker-bike.png';
import spaceInvaderMarkerImageUrl from '@/assets/markers/invaders/marker-invaders.png';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';

export interface MapLayerFilter {
  label: string;
  icon: string;
  ariaLabel: string;
  selected: boolean;
  onClick: () => void;
}

export const useMapLayerFilters = (): MapLayerFilter[] => {
  const isMetroMarkersVisible = useMapLayersStore((state) => state.isMetroMarkersVisible);
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);
  const isSpaceInvadersVisible = useMapLayersStore((state) => state.isSpaceInvadersVisible);
  const toggleMetroMarkers = useMapLayersStore((state) => state.toggleMetroMarkers);
  const toggleVelibMarkers = useMapLayersStore((state) => state.toggleVelibMarkers);
  const toggleSpaceInvaders = useMapLayersStore((state) => state.toggleSpaceInvaders);

  return [
    {
      label: 'Métro',
      icon: subwayMarkerImageUrl,
      ariaLabel: 'stations métro et RER',
      selected: isMetroMarkersVisible,
      onClick: toggleMetroMarkers,
    },
    {
      label: 'Vélib',
      icon: velibMarkerImageUrl,
      ariaLabel: 'stations Vélib',
      selected: isVelibMarkersVisible,
      onClick: toggleVelibMarkers,
    },
    {
      label: 'Invaders',
      icon: spaceInvaderMarkerImageUrl,
      ariaLabel: 'Space Invaders',
      selected: isSpaceInvadersVisible,
      onClick: toggleSpaceInvaders,
    },
  ];
};
