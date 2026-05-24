import useWanderAppTourStore from '@/store/zustand/useWanderAppTourStore';
import { Navigate, Outlet } from 'react-router-dom';

type WanderAppTourGuardProps = {
  requireWelcomeSeen: boolean;
};

const WanderAppTourGuard = ({ requireWelcomeSeen }: WanderAppTourGuardProps) => {
  const hasSeenWelcome = useWanderAppTourStore((state) => state.hasSeenWelcome);
  const isBot = document.cookie.includes('x-wander-bot=1');

  if (!isBot && requireWelcomeSeen && !hasSeenWelcome) return <Navigate to="/map-tour" replace />;
  if (!isBot && !requireWelcomeSeen && hasSeenWelcome) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default WanderAppTourGuard;
