import { useProposalsCountFromApi } from '../../api/hooks/useProposals';
import Container from '../Container/Container';
import Link from '../Link';
import s from './Governance.module.css';

const Governance: React.FC = () => {
  const { data: proposalsCount, isLoading } = useProposalsCountFromApi();

  return !isLoading && proposalsCount ? (
    <Container className={s.root}>
      <div className={s.card} key="bounty">
        <div className={s.textWrapper}>
          <div>
            <h2>
              Money Markets governed
              <br />
              by community
            </h2>
            <p>
              Venus is a community-driven decentralized protocol delivering best-in-class
              functionality for crypto money markets.
            </p>
            <Link className={s.link} href="https://community.venus.io/">
              Governance forum
            </Link>
          </div>
        </div>
        <div className={s.rings}>
          <div className={s.proposalsInfo}>
            <span className={s.numProposals}>{proposalsCount}</span>
            <span className={s.proposals}>Venus Improvement Proposals Executed and counting</span>
          </div>
        </div>
      </div>
    </Container>
  ) : null;
};

export default Governance;
