import { cn } from '@venusprotocol/ui';
import Container from '../Container/Container';
import s from './Background.module.css';
import Intro from './Intro';
import Market from './Market';

interface IMainContentProps {
  className?: string;
}

const Background: React.FC<IMainContentProps> = ({ className }) => (
  <section className={cn(s.bg, className)}>
    <Container className={s.content}>
      <Intro />
      <Market />
    </Container>
  </section>
);

export default Background;
