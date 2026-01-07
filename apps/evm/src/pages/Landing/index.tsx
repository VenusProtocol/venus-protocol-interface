import { DISCORD_SERVER_URL } from 'constants/landing';
import { useEffect } from 'react';
import Background from './Background';
import Benefits from './Benefits';
import Governance from './Governance';
import Protection from './Protection';
import Safety from './Safety';
import VenusPrime from './VenusPrime';
import Wallets from './Wallets';

export const Landing: React.FC = () => {
  useEffect(() => {
    if (window.location.pathname.startsWith('/discord')) {
      window.location.replace(DISCORD_SERVER_URL);
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen m-w-[320px]">
      <Background />
      <VenusPrime />
      <Protection />
      <Governance />
      <Safety />
      <Benefits />
      <Wallets />
    </div>
  );
};

export default Landing;
