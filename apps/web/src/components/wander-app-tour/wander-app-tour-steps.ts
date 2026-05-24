import { type Step } from 'react-joyride';
import usePanelStore from '@/store/zustand/usePanelStore';

const isMobile = window.innerWidth < 768;

const toggleWeatherPanel = async () => {
  usePanelStore.getState().toggleWeatherPanel();
  await new Promise((resolve) => setTimeout(resolve, 700));
};

const toggleFilterPanel = async () => {
  usePanelStore.getState().togglePanel();
  await new Promise((resolve) => setTimeout(resolve, 1400));
};

const desktopSteps: Step[] = [
  {
    content:
      "Le ciel parisien du moment, version paper cut. L'icône change selon le temps qu'il fait et l'heure qu'il est.",
    target: '.weather-icon',
    placement: 'bottom' as const,
    skipBeacon: true,
  },
  {
    content: 'Température et vent en direct — pour savoir si on prend la veste ou pas.',
    target: '.weather-info',
    placement: 'bottom' as const,
    skipBeacon: true,
  },
  {
    content: "Le panneau filtres se cache derrière ce bouton. Cliquez, ça s'ouvre.",
    target: '.toggle-filter-panel',
    placement: 'bottom' as const,
    skipBeacon: true,
  },
  {
    content: 'Métro, Vélib, Space Invaders — vous choisissez ce qui apparaît sur la carte.',
    target: '.filter-panel',
    placement: 'left' as const,
    skipBeacon: true,
    before: toggleFilterPanel,
  },
  {
    content: 'Ce soir, ce week-end, la semaine prochaine — choisissez votre moment.',
    target: '.period-filters',
    placement: 'left' as const,
    skipBeacon: true,
  },
  {
    content: "Expo, concert, festival, atelier — selon l'envie du jour.",
    target: '.tag-filters',
    placement: 'left' as const,
    skipBeacon: true,
  },
  {
    content: 'Et hop, on applique. La carte se met à jour.',
    target: '.apply-filters',
    placement: 'left' as const,
    skipBeacon: true,
    after: toggleFilterPanel,
  },
  {
    content: "Chaque marqueur, c'est un événement qui vous tend les bras. Cliquez pour faire connaissance.",
    target: '.wander-map',
    placement: 'center' as const,
    skipBeacon: true,
  },
];

const mobileSteps: Step[] = [
  {
    content: 'Le panneau météo se cache derrière ce bouton. Appuyez sur Suivant pour le découvrir.',
    target: '.weather-mobile-toggle',
    placement: 'bottom' as const,
    skipBeacon: true,
  },
  {
    content: 'Température et vent en direct — pour savoir si on prend la veste ou pas.',
    target: '.weather-mobile-panel-info',
    placement: 'bottom' as const,
    skipBeacon: true,
    before: toggleWeatherPanel,
  },
  {
    content:
      "Le ciel parisien du moment, version paper cut. L'icône change selon le temps qu'il fait et l'heure qu'il est.",
    target: '.weather-mobile-panel-icon',
    placement: 'bottom' as const,
    skipBeacon: true,
  },
  {
    content: 'Le panneau filtres se cache derrière ce bouton. Appuyez sur Suivant pour le découvrir.',
    target: '.toggle-filter-panel-mobile',
    placement: 'top' as const,
    skipBeacon: true,
    before: toggleWeatherPanel,
  },
  {
    content: 'Métro, Vélib, Space Invaders — vous choisissez ce qui apparaît sur la carte.',
    target: '.filter-panel-mobile',
    placement: 'top' as const,
    skipBeacon: true,
    before: toggleFilterPanel,
  },
  {
    content: 'Ce soir, ce week-end, la semaine prochaine — choisissez votre moment.',
    target: '.mobile-filters .period-filters',
    placement: 'top' as const,
    skipBeacon: true,
  },
  {
    content: "Expo, concert, festival, atelier — selon l'envie du jour.",
    target: '.mobile-filters .tag-filters',
    placement: 'top' as const,
    skipBeacon: true,
  },
  {
    content: 'Et hop, on applique. La carte se met à jour.',
    target: '.mobile-filters .apply-filters',
    placement: 'top' as const,
    skipBeacon: true,
    after: toggleFilterPanel,
  },
  {
    content: "Chaque marqueur, c'est un événement qui vous tend les bras. Cliquez pour faire connaissance.",
    target: '.wander-map',
    placement: 'center' as const,
    skipBeacon: true,
  },
];

export const wanderAppTourSteps: Step[] = isMobile ? mobileSteps : desktopSteps;
