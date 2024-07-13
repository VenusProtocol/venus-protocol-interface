import cn from 'classnames';
import Container from '../Container/Container';
import s from './Protection.module.css';

interface IProtectionProps {
  className?: string;
}

const Protection: React.FC<IProtectionProps> = ({ className }) => (
  <Container className={cn(s.root, className)}>
    <ul className={s.list}>
      <li className={cn(s.item, s.bugBounty)} key="bounty">
        <div className={s.textWrapper}>
          <h2>Challenge our code and be rewarded</h2>
          <p>
            We encourage all to challenge our code and search for vulnerabilities. Read about our{' '}
            bug bounty rewards, and please submit any bug you identify.
          </p>
        </div>
        <div className={cn(s.backgroundImg, s.bugBountyImg)} />
      </li>
      <li className={cn(s.item, s.protectionPrioritized)} key="protection">
        <div className={s.textWrapper}>
          <h2>Protection prioritized</h2>
          <p>Maintaining a fallback pool to keep us all safe in the case of outlier events</p>
        </div>
        <div className={cn(s.backgroundImg, s.protectionPrioritizedImg)} />
      </li>
    </ul>
  </Container>
);

export default Protection;
