import cn from 'classnames';
import Benefits from '../Benefits/Benefits';
import Governance from '../Governance';
import Header from '../Header/Header';
import Partners from '../Partners';
import Protection from '../Protection';
import Safety from '../Safety';
import VenusPrime from '../VenusPrime';
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
    <Partners />
  </section>
);

export default MainContent;
