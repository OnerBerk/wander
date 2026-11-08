import { useId } from 'react';
import iaIcon from '@/assets/icons/IA-icon.png';
import usePanelStore from '@/store/zustand/usePanelStore';

const AiPanel = () => {
  const titleId = useId();
  const isOpen = usePanelStore((state) => state.isAiPanelOpen);
  const closeAiPanel = usePanelStore((state) => state.closeAiPanel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 grid place-items-center">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-black/30" onClick={closeAiPanel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-wander-crem relative w-[90vw] rounded-2xl p-6 md:w-auto"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <img src={iaIcon} alt="" className="h-auto w-full object-contain md:h-150 md:w-150" />
          <h2 id={titleId} className="text-wander-text text-xl font-semibold">
            Agent-ia is coming soon
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
