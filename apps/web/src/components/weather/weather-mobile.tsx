import { useEffect, useId, useState } from 'react';
import { CloudSun, X } from 'lucide-react';
import { useIsDay } from '@/hooks/useIsDay';
import { useWeatherIcon } from '@/hooks/useWeatherIcon';
import { useWeather } from '@/api/features/weather/queries/use-weather';
import usePanelStore from '@/store/zustand/usePanelStore';
import UIClosePanelButton from '@/ui-components/ui-close-panel-button';

const WeatherMobile = () => {
  const titleId = useId();
  const [phase, setPhase] = useState<'closed' | 'bubble' | 'expanded'>('closed');

  const { data: weather } = useWeather();
  const isOpen = usePanelStore((state) => state.isWeatherPanelOpen);
  const toggleWeatherPanel = usePanelStore((state) => state.toggleWeatherPanel);
  const closeWeatherPanel = usePanelStore((state) => state.closeWeatherPanel);

  const icon = useWeatherIcon();
  const isDay = useIsDay();

  useEffect(() => {
    if (isOpen) {
      setPhase('bubble');
      const timeout = setTimeout(() => setPhase('expanded'), 700);
      return () => clearTimeout(timeout);
    }

    setPhase('bubble');
    const timeout = setTimeout(() => setPhase('closed'), 500);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  const panelStyle = {
    closed: {
      top: '16px',
      left: '40px',
      width: '44px',
      height: '44px',
      opacity: 0,
      transform: 'translateX(-50%) scale(0.3)',
      backdropFilter: 'blur(0px)',
    },
    bubble: {
      top: '72px',
      left: '40px',
      width: '44px',
      height: '44px',
      borderRadius: '9999px',
      opacity: 1,
      transform: 'translateX(-50%) scale(1)',
      backgroundColor: '#93c5fd',
      backdropFilter: 'blur(0px)',
    },
    expanded: {
      top: '72px',
      left: '16px',
      width: 'calc(100vw - 32px)',
      height: 'calc(100dvh - 152px)',
      borderRadius: '24px',
      opacity: 1,
      transform: 'translateX(0) scale(1)',
      backdropFilter: 'blur(12px)',
    },
  }[phase];

  return (
    <div
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen ? 'true' : undefined}
      aria-labelledby={isOpen ? titleId : undefined}
      className="md:hidden"
    >
      <div
        className={phase === 'expanded' ? (isDay ? 'header-day' : 'header-night') : undefined}
        style={{
          zIndex: 94,
          position: 'fixed',
          ...panelStyle,
          WebkitBackdropFilter: panelStyle.backdropFilter,
          pointerEvents: phase === 'expanded' ? 'auto' : 'none',
          transition: 'all 600ms cubic-bezier(0.34, 1.4, 0.64, 1)',
          transformOrigin: 'top left',
          boxShadow: '0 10px 25px rgba(30, 64, 175, 0.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: 'white',
            opacity: phase === 'bubble' ? 1 : 0,
            transition: 'opacity 200ms ease-out',
            transitionDelay: phase === 'bubble' ? '200ms' : '0ms',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            transition: 'opacity 250ms',
            transitionDelay: phase === 'expanded' ? '300ms' : '0ms',
            opacity: phase === 'expanded' ? 1 : 0,
          }}
          className="grid h-full grid-rows-6 gap-2 p-4"
        >
          <UIClosePanelButton
            ariaLabel="Fermer la météo"
            onClose={closeWeatherPanel}
            className="focus-visible:ring-sky-500"
          />
          <h2 id={titleId} className="sr-only">
            Météo actuelle
          </h2>
          <div className="flex flex-col items-center justify-center">
            <p className="text-5xl font-medium text-slate-700">{weather ? `${weather?.temperature}°C` : ''}</p>
            <p className="text-xl font-medium text-slate-700">{weather ? `${weather?.windSpeed} km/h` : ''}</p>
          </div>
          {icon && <img src={icon.src} alt={icon.alt} className="row-span-5 h-full w-full object-contain" />}
        </div>
      </div>

      <button
        type="button"
        aria-label={isOpen ? 'Fermer la météo' : 'Ouvrir la météo'}
        onClick={toggleWeatherPanel}
        style={{ zIndex: 100 }}
        className="fixed top-4 left-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-sky-100/60 bg-sky-200/60 shadow-lg backdrop-blur-md focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <CloudSun className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default WeatherMobile;
