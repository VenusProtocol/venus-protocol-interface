import { cn } from 'components';
import { Container } from 'components/Container';
import { Link } from 'components/Link';
import s from './index.module.css';

const VenusPrime: React.FC = () => (
  <Container className={s.root}>
    <div className={s.card} key="bounty">
      <div className={cn(s.backgroundImg, s.venusPrimeLogo)} />
      <div className={s.logoMobile} />
      <div className={s.textWrapper}>
        <h2 className="m-0">
          <span className={s.accent}>Venus Prime</span> rewards loyalty
          <br /> with superior rewards
        </h2>
        <p className="m-0">
          With Venus Prime, dedicated users obtain boosted rewards when they lend and borrow on
          Venus while staking in the governance vault.
        </p>
        <Link className={s.link} href="https://docs-v4.venus.io/whats-new/prime-yield">
          Learn more
        </Link>
      </div>
    </div>
  </Container>
);

export default VenusPrime;
