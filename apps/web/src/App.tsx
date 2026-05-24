import { useRoutes } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Joyride, STATUS, type EventData } from 'react-joyride';
import { routes } from '@/pages/routes';
import { wanderAppTourSteps } from './components/wander-app-tour/wander-app-tour-steps';
import useWanderAppTourStore from './store/zustand/useWanderAppTourStore';
import WanderTourTooltip from './components/wander-app-tour/wander-tour-tooltip';

const App = () => {
  const hasSeenWelcome = useWanderAppTourStore((state) => state.hasSeenWelcome);
  const isDataTourDone = useWanderAppTourStore((state) => state.isDataTourDone);
  const setIsDataTourDone = useWanderAppTourStore((state) => state.setIsDataTourDone);

  const handleJoyrideEvent = (data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      setIsDataTourDone();
    }
  };

  return (
    <>
      <Joyride
        continuous
        run={hasSeenWelcome && !isDataTourDone}
        steps={wanderAppTourSteps}
        onEvent={handleJoyrideEvent}
        tooltipComponent={WanderTourTooltip}
      />
      <SpeedInsights />
      {useRoutes(routes)}
    </>
  );
};

export default App;
