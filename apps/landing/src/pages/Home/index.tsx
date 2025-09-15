import Background from './Background/Background';
import Benefits from './Benefits/Benefits';
import Governance from './Governance';
import Protection from './Protection';
import Safety from './Safety';
import VenusPrime from './VenusPrime';
import Wallets from './Wallets';
import s from './index.module.css';

export const Home: React.FC = () => (
  <main className={s.root}>
    <Background />
    <VenusPrime />
    <Protection />
    <Governance />
    <Safety />
    <Benefits />
    <Wallets />
  </main>
);
