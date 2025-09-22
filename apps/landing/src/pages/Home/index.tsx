import Background from './Background/Background';
import Benefits from './Benefits/Benefits';
import Governance from './Governance';
import Protection from './Protection';
import Safety from './Safety';
import VenusPrime from './VenusPrime';
import Wallets from './Wallets';

export const Home: React.FC = () => (
  <>
    <Background />
    <VenusPrime />
    <Protection />
    <Governance />
    <Safety />
    <Benefits />
    <Wallets />
  </>
);
