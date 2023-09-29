/** @jsxImportSource @emotion/react */
import { FormikSubmitButton, FormikTextField, Modal, TextField } from 'components';
import { ContractReceipt } from 'ethers';
import { Form, Formik } from 'formik';
import { useGetToken } from 'packages/tokens';
import React from 'react';
import { useTranslation } from 'translation';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface VoteModalProps {
  voteModalType: 0 | 1 | 2;
  handleClose: () => void;
  vote: (voteReason: string) => Promise<ContractReceipt>;
  readableVoteWeight: string;
  isVoteLoading: boolean;
}

// TODO: add tests

const VoteModal: React.FC<VoteModalProps> = ({
  handleClose,
  vote,
  readableVoteWeight,
  voteModalType = 0,
  isVoteLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const handleTransactionMutation = useHandleTransactionMutation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  let title: string;
  let successModalTitle: string;
  switch (voteModalType) {
    case 0:
      title = t('vote.voteAgainst');
      successModalTitle = t('vote.youSuccessfullyVotedAgainstTheProposal');
      break;
    case 1:
      title = t('vote.voteFor');
      successModalTitle = t('vote.youSuccessfullyVotedForTheProposal');
      break;
    case 2:
      title = t('vote.voteAbstain');
      successModalTitle = t('vote.youSuccessfullyVotedAbstained');
      break;
    // no default
  }

  const handleOnSubmit = async ({ reason }: { reason: string }) => {
    await handleTransactionMutation({
      mutate: async () => {
        const result = await vote(reason);
        handleClose();
        return result;
      },
      successTransactionModalProps: contractReceipt => ({
        title: successModalTitle,
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return (
    <Modal
      isOpen={voteModalType !== undefined}
      handleClose={handleClose}
      title={title}
      css={styles.root}
    >
      <Formik initialValues={{ reason: '' }} onSubmit={handleOnSubmit}>
        {() => (
          <Form>
            <TextField
              label={t('vote.votingPower')}
              name="votingPower"
              id="votingPower"
              leftIconSrc={xvs}
              disabled
              value={readableVoteWeight}
              css={styles.votingPower}
            />
            <FormikTextField
              label={t('vote.comment')}
              name="reason"
              id="reason"
              placeholder={t('vote.addComment')}
              maxLength={256}
              css={styles.comment}
            />
            <FormikSubmitButton
              enabledLabel={title}
              fullWidth
              loading={isVoteLoading}
              data-testid={TEST_IDS.submitButton}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default VoteModal;
