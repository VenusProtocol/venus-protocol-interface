/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'translation';
import { useGetProposals } from 'clients/api';
import { Icon, Spinner, TextButton, Tooltip, Pagination } from 'components';
import { IProposal } from 'types';
import GovernanceProposal from '../GovernanceProposal';
import CreateProposalModal from '../CreateProposalModal';
import { FormValues } from '../CreateProposalModal/proposalSchema';
import { useStyles } from './styles';

interface IGovernanceUiProps {
  proposals: IProposal[];
  isLoading: boolean;
  total: number | undefined;
  limit: number;
  setCurrentPage: (page: number) => void;
  createProposal: (data: FormValues) => void;
}

export const GovernanceUi: React.FC<IGovernanceUiProps> = ({
  proposals,
  isLoading,
  total,
  limit,
  setCurrentPage,
  createProposal,
}) => {
  const [showCreateProposalModal, setShowCreateProposalModal] = useState(false);
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <div css={[styles.header, styles.bottomSpace]}>
        <Typography variant="h4">{t('vote.governanceProposals')}</Typography>
        <div css={styles.createProposal}>
          <TextButton onClick={() => setShowCreateProposalModal(true)} css={styles.marginless}>
            {t('vote.createProposalPlus')}
          </TextButton>
          <Tooltip title={t('vote.requiredVotingPower')} css={styles.infoIcon}>
            <Icon name="info" />
          </Tooltip>
        </div>
      </div>
      {isLoading && <Spinner />}
      <div>
        {proposals.map(
          ({
            id,
            description,
            state,
            endDate,
            forVotesWei,
            abstainedVotesWei,
            againstVotesWei,
          }) => (
            <GovernanceProposal
              key={id}
              css={styles.bottomSpace}
              proposalNumber={id}
              proposalTitle={description.title}
              proposalState={state}
              endDate={endDate}
              forVotesWei={forVotesWei}
              againstVotesWei={againstVotesWei}
              abstainedVotesWei={abstainedVotesWei}
            />
          ),
        )}
      </div>
      {total && (
        <Pagination
          css={styles.pagination}
          itemsCount={total}
          onChange={(nextIndex: number) => {
            setCurrentPage(nextIndex);
            window.scrollTo(0, 0);
          }}
          itemsPerPageCount={limit}
        />
      )}
      {showCreateProposalModal && (
        <CreateProposalModal
          isOpen={showCreateProposalModal}
          handleClose={() => setShowCreateProposalModal(false)}
          createProposal={createProposal}
        />
      )}
    </div>
  );
};

const Governance: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: { proposals, total, limit = 5 } = { proposals: [] }, isLoading } = useGetProposals({
    page: currentPage,
  });

  const createProposal = () => {};

  return (
    <GovernanceUi
      proposals={proposals}
      isLoading={isLoading}
      total={total}
      limit={limit}
      setCurrentPage={setCurrentPage}
      createProposal={createProposal}
    />
  );
};

export default Governance;
