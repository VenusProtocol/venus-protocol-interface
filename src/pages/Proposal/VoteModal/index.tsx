/** @jsxImportSource @emotion/react */
import { FormikSubmitButton, FormikTextField, Modal, TextField } from 'components';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'translation';
import type { TransactionReceipt } from 'web3-core';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface VoteModalProps {
  voteModalType: 0 | 1 | 2;
  handleClose: () => void;
  vote: (voteReason: string) => Promise<TransactionReceipt>;
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
      successTransactionModalProps: transactionReceipt => ({
        title: successModalTitle,
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: transactionReceipt.transactionHash,
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
              leftIconName="xvs"
              disabled
              value={readableVoteWeight}
              css={styles.votingPower}
            />
            <FormikTextField
              label={t('vote.comment')}
              name="reason"
              id="reason"
              placeholder={t('vote.addComment')}
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
