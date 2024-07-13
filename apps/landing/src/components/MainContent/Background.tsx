import cn from 'classnames';
import Market from '../Market/Market';
import s from './Background.module.css';
import Intro from './Intro';

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
