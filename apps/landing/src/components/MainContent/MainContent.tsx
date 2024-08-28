import cn from 'classnames';
import Benefits from '../Benefits/Benefits';
import Governance from '../Governance';
import Header from '../Header/Header';
import Protection from '../Protection';
import Safety from '../Safety';
import VenusPrime from '../VenusPrime';
import Wallets from '../Wallets';
import Background from './Background';
import s from './MainContent.module.css';

interface IMainContentProps {
  className?: string;
}

const MainContent: React.FC<IMainContentProps> = ({ className }) => (
  <section className={cn(s.root, className)}>
    <Header />
    <Background />
    <VenusPrime />
    <Protection />
    <Governance />
    <Safety />
    <Benefits />
    <Wallets />
  </section>
);

export default MainContent;
