import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadMapPage } from '@/pages/load-map-page';

const BOUNCE = 'ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]';

interface ViewSwitchProps {
  className?: string;
}

const ViewSwitch: React.FC<ViewSwitchProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMap = pathname.startsWith('/map');

  const toggleView = () => {
    navigate(isMap ? '/' : '/map');
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMap}
      aria-label={isMap ? 'Passer en vue liste' : 'Passer en vue carte'}
      data-view={isMap ? 'map' : 'list'}
      onClick={toggleView}
      onPointerEnter={() => {
        void loadMapPage();
      }}
      onTouchStart={() => {
        void loadMapPage();
      }}
      className={`group relative inline-flex h-9 w-[88px] shrink-0 cursor-pointer overflow-hidden rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${className}`}
    >
      <span className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc,#cbd5e1)]" />

      <span className="absolute inset-0 bg-[linear-gradient(135deg,#bbf7d0,#99f6e4_50%,#7dd3fc)] opacity-0 transition-opacity duration-500 group-data-[view=map]:opacity-100" />

      <svg
        viewBox="0 0 88 36"
        aria-hidden
        className="absolute inset-0 h-full w-full scale-150 opacity-0 transition-all duration-700 ease-out group-data-[view=map]:scale-100 group-data-[view=map]:opacity-100"
      >
        <rect x="6" y="4" width="12" height="9" rx="2" fill="#86efac" />
        <rect x="22" y="22" width="14" height="10" rx="2" fill="#86efac" />
        <rect x="40" y="3" width="10" height="8" rx="2" fill="#6ee7b7" />
        <path
          d="M-2 30 C 14 26, 18 14, 34 16 S 54 30, 90 20"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M0 18 H90 M28 -2 V40" fill="none" stroke="#fff" strokeWidth="2" opacity="0.9" />
        <path d="M0 18 H90" fill="none" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="2 2" />
      </svg>

      <Pin className="top-[5px] left-[9px] delay-150" />
      <Pin className="top-[9px] left-[36px] delay-300" />

      <span className="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-[3px]" aria-hidden>
        {['delay-0', 'delay-75', 'delay-150'].map((delay, i) => (
          <span
            key={delay}
            className={`flex items-center gap-1 transition-all duration-500 ${delay} group-data-[view=map]:translate-x-12 group-data-[view=map]:opacity-0`}
          >
            <span className="h-1 w-1 rounded-full bg-slate-500" />
            <span className={`h-1 rounded-full bg-slate-400 ${i === 1 ? 'w-5' : 'w-7'}`} />
          </span>
        ))}
      </span>

      <span
        className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_-2px_0_rgba(0,0,0,0.08)] transition-all duration-500 ${BOUNCE} group-data-[view=map]:translate-x-[52px] group-data-[view=map]:bg-rose-500`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`absolute inset-0 m-auto h-4 w-4 text-slate-600 transition-all duration-500 ${BOUNCE} group-data-[view=map]:scale-0 group-data-[view=map]:-rotate-90 group-data-[view=map]:opacity-0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`absolute inset-0 m-auto h-4 w-4 scale-0 rotate-90 text-white opacity-0 transition-all duration-500 ${BOUNCE} group-data-[view=map]:scale-100 group-data-[view=map]:rotate-0 group-data-[view=map]:opacity-100 group-data-[view=map]:delay-100`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      </span>
    </button>
  );
};

const Pin: React.FC<{ className: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={`absolute h-3 w-3 -translate-y-8 opacity-0 transition-all duration-500 ${BOUNCE} group-data-[view=map]:translate-y-0 group-data-[view=map]:opacity-100 ${className}`}
  >
    <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="#f43f5e" />
    <circle cx="12" cy="10" r="2.6" fill="#fff" />
  </svg>
);

export default ViewSwitch;
