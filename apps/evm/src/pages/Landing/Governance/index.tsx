import { useProposalsCountFromApi } from 'clients/api/queries/getProposalsCountFromApi/useGetProposalsCountFromApi';
import { Container } from 'components/Container';
import { Link } from 'components/Link';
import { COMMUNITY_URL } from 'constants/landing';
import s from './index.module.css';

const Governance: React.FC = () => {
  const { data: proposalsCount, isLoading } = useProposalsCountFromApi();

  return !isLoading && proposalsCount ? (
    <Container className={s.root}>
      <div className={s.card} key="bounty">
        <div className={s.textWrapper}>
          <div>
            <h2 className="m-0">
              Money Markets governed
              <br />
              by community
            </h2>
            <p className="m-0">
              Venus is a community-driven decentralized protocol delivering best-in-class
              functionality for crypto money markets.
            </p>
            <Link className={s.link} href={COMMUNITY_URL}>
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
