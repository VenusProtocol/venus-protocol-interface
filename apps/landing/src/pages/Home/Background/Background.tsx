import { cn } from '@venusprotocol/ui';
import Intro from '../Intro/Intro';
import Market from '../Market/Market';
import s from './Background.module.css';

interface IMainContentProps {
  className?: string;
}

const Background: React.FC<IMainContentProps> = ({ className }) => (
  <section className={cn(s.bg, className)}>
    <Intro />
    <Market />
  </section>
);

export default Background;
