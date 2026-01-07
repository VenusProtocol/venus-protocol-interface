import { cn } from 'components';
import Intro from '../Intro';
import Market from '../Market';

interface IMainContentProps {
  className?: string;
}

const bg = '';

const Background: React.FC<IMainContentProps> = ({ className }) => (
  <section className={cn(bg, className)}>
    <Intro />
    <Market />
  </section>
);

export default Background;
