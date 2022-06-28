/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import type { TransactionReceipt } from 'web3-core';
import { Typography } from '@mui/material';
import { AuthContext } from 'context/AuthContext';
import {
  useGetProposals,
  useCreateProposal,
  ICreateProposalInput,
  useGetCurrentVotes,
} from 'clients/api';
import { Icon, Spinner, TextButton, Tooltip, Pagination } from 'components';
import CREATE_PROPOSAL_THRESHOLD_WEI from 'constants/createProposalThresholdWei';
import { IProposal } from 'types';
import { useTranslation } from 'translation';
import GovernanceProposal from '../GovernanceProposal';
import CreateProposalModal from '../CreateProposalModal';
import { useStyles } from './styles';

interface IGovernanceUiProps {
  proposals: IProposal[];
  isLoading: boolean;
  total: number | undefined;
  limit: number;
  setCurrentPage: (page: number) => void;
  createProposal: (
    payload: Omit<ICreateProposalInput, 'accountAddress'>,
  ) => Promise<TransactionReceipt>;
  isCreateProposalLoading: boolean;
  canCreateProposal: boolean;
}

export const GovernanceUi: React.FC<IGovernanceUiProps> = ({
  proposals,
  isLoading,
  total,
  limit,
  setCurrentPage,
  createProposal,
  isCreateProposalLoading,
  canCreateProposal,
}) => {
  const [showCreateProposalModal, setShowCreateProposalModal] = useState(false);
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <div css={[styles.header, styles.bottomSpace]}>
        <Typography variant="h4">{t('vote.governanceProposals')}</Typography>
        {canCreateProposal && (
          <div css={styles.createProposal}>
            <TextButton onClick={() => setShowCreateProposalModal(true)} css={styles.marginless}>
              {t('vote.createProposalPlus')}
            </TextButton>
            <Tooltip title={t('vote.requiredVotingPower')} css={styles.infoIcon}>
              <Icon name="info" />
            </Tooltip>
          </div>
        )}
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
              proposalId={id}
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
          isCreateProposalLoading={isCreateProposalLoading}
        />
      )}
    </div>
  );
};

const Governance: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const accountAddress = account?.address || '';
  const [currentPage, setCurrentPage] = useState(0);
  const { data: { proposals, total, limit = 5 } = { proposals: [] }, isLoading } = useGetProposals({
    page: currentPage,
  });
  const { mutateAsync: createProposal, isLoading: isCreateProposalLoading } = useCreateProposal();

  const { data: currentVotesWei } = useGetCurrentVotes(
    { accountAddress },
    { enabled: !!accountAddress },
  );
  const canCreateProposal = currentVotesWei?.isGreaterThanOrEqualTo(CREATE_PROPOSAL_THRESHOLD_WEI);
  return (
    <GovernanceUi
      proposals={proposals}
      isLoading={isLoading}
      total={total}
      limit={limit}
      setCurrentPage={setCurrentPage}
      canCreateProposal={!!canCreateProposal}
      createProposal={payload => createProposal({ ...payload, accountAddress })}
      isCreateProposalLoading={isCreateProposalLoading}
    />
  );
};

export default Governance;
