import { createBikeMarkerElement } from '@/assets/markers/bike/bike-marker';
import maplibregl from 'maplibre-gl';

const MARKER_BOUNCE_IN_CLASS = 'marker-bounce-in-twice';

export const calculateRadius = (zoom: number) => {
  return Math.max(0.1, 50 / Math.pow(2, zoom - 10));
};

export const applyMarkerEntranceBounce = (markerContent: HTMLElement, delayMs = 0): HTMLElement => {
  const root = document.createElement('div');
  const animatedWrapper = document.createElement('div');
  animatedWrapper.className = MARKER_BOUNCE_IN_CLASS;
  animatedWrapper.style.animationDelay = `${delayMs}ms`;
  animatedWrapper.appendChild(markerContent);
  root.appendChild(animatedWrapper);
  return root;
};

export const getVelibMarkerElement = (bikesAvailable: number, delayMs = 0): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'relative h-8 w-8 md:h-10 md:w-10';

  const marker = createBikeMarkerElement();
  container.appendChild(marker);

  const availabilityBadge = document.createElement('span');
  availabilityBadge.className =
    'absolute -right-1 -top-1 rounded-full bg-white px-1 py-0.5 text-[10px] font-semibold text-slate-900 shadow md:px-1.5 md:text-xs';
  availabilityBadge.textContent = String(bikesAvailable);
  container.appendChild(availabilityBadge);

  return applyMarkerEntranceBounce(container, delayMs);
};

interface AnimateFeatureStateEntranceParams {
  targetMap: maplibregl.Map;
  sourceId: string;
  featureIds: string[];
  staggerMs: number;
  maxDelayMs: number;
  durationMs: number;
}

export const animateFeatureStateEntrance = ({
  targetMap,
  sourceId,
  featureIds,
  staggerMs,
  maxDelayMs,
  durationMs,
}: AnimateFeatureStateEntranceParams): (() => void) => {
  const timeoutIds: number[] = [];
  const frameIds: number[] = [];

  featureIds.forEach((featureId, index) => {
    try {
      targetMap.setFeatureState({ source: sourceId, id: featureId }, { enterProgress: 0 });
    } catch {
      return;
    }

    const delayMs = Math.min(index * staggerMs, maxDelayMs);
    const timeoutId = window.setTimeout(() => {
      const startedAt = performance.now();
      const tick = (now: number): void => {
        const progress = Math.min((now - startedAt) / durationMs, 1);
        try {
          targetMap.setFeatureState({ source: sourceId, id: featureId }, { enterProgress: progress });
        } catch {
          return;
        }
        if (progress < 1) {
          frameIds.push(window.requestAnimationFrame(tick));
        }
      };
      frameIds.push(window.requestAnimationFrame(tick));
    }, delayMs);

    timeoutIds.push(timeoutId);
  });

  return () => {
    timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
  };
};
