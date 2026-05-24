import useWanderAppTourStore from '@/store/zustand/useWanderAppTourStore';
import bgParis from '@/assets/backgrounds/bg-paris-web.jpeg';
import bgParisMobile from '@/assets/backgrounds/bg-paris-mobile.jpeg';

const WanderWelcomeOverlay = () => {
  const hasSeenWelcome = useWanderAppTourStore((state) => state.hasSeenWelcome);
  const setHasSeenWelcome = useWanderAppTourStore((state) => state.setHasSeenWelcome);
  const setIsDataTourDone = useWanderAppTourStore((state) => state.setIsDataTourDone);

  if (hasSeenWelcome) return null;

  const handleSkip = () => {
    setHasSeenWelcome();
    setIsDataTourDone();
  };

  const handleStartTour = () => {
    setHasSeenWelcome();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-2">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 rounded-lg px-4 text-center md:px-30">
        <div
          className="absolute inset-0 rounded-lg bg-cover bg-center md:hidden"
          style={{ backgroundImage: `url(${bgParisMobile})` }}
        />
        <div
          className="absolute inset-0 hidden rounded-lg bg-cover bg-center md:block"
          style={{ backgroundImage: `url(${bgParis})` }}
        />
        <h1 className="text-wander-orange relative z-10 text-5xl font-bold md:text-7xl">Wander City</h1>
        <p className="relative z-10 w-full max-w-6xl rounded-lg border border-gray-300 bg-white/20 p-6 text-justify text-sm backdrop-blur-md md:p-10 md:text-xl">
          Bienvenue sur Wander.
          <br /> Une carte vivante qui rassemble tout ce qui se passe à Paris — expos, musées, festivals, concerts.
          <br /> Filtrez par envie, par budget. Trouvez quoi faire aujourd'hui, ce week-end, ou là tout de suite si
          l'envie vous prend.
          <br /> Et pour rendre la sortie facile : Vélib en temps réel, stations de métro à proximité, météo à
          l'instant T, et même les Space Invaders à débusquer en chemin (approximativement — c'est plus drôle).
          <br /> Bientôt : un compagnon IA qui vous compose le parcours parfait selon votre humeur du jour.
          <br /> Et après Paris, d'autres villes — parce que toutes les villes méritent qu'on s'y perde un peu.
        </p>
        <div className="relative z-10 flex gap-4">
          <button
            type="button"
            onClick={handleSkip}
            className="cursor-pointer rounded-full border border-gray-300 bg-white/20 px-6 py-3 text-xs font-medium text-gray-600 backdrop-blur-md transition hover:bg-gray-100"
          >
            Plongez dans la carte
          </button>
          <button
            type="button"
            onClick={handleStartTour}
            className="bg-wander-orange text-wander-text-white cursor-pointer rounded-full px-6 py-3 text-xs font-medium transition hover:opacity-90"
          >
            Faites le tour du proprio
          </button>
        </div>
      </div>
    </div>
  );
};

export default WanderWelcomeOverlay;
