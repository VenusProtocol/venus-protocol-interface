/** @jsxImportSource @emotion/react */
import React from 'react';
import type { TransactionReceipt } from 'web3-core';
import { Formik, Form } from 'formik';
import { Modal, FormikTextField, TextField, FormikSubmitButton, toast } from 'components';
import { useTranslation } from 'translation';
import { VError, formatVErrorToReadableString } from 'errors';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { useStyles } from './styles';

interface IVoteModal {
  voteModalType: 0 | 1 | 2;
  handleClose: () => void;
  vote: (voteReason: string) => Promise<TransactionReceipt>;
  readableVoteWeight: string;
  isVoteLoading: boolean;
}

const VoteModal: React.FC<IVoteModal> = ({
  handleClose,
  vote,
  readableVoteWeight,
  voteModalType = 0,
  isVoteLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

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
    try {
      const transactionReceipt = await vote(reason);
      handleClose();
      openSuccessfulTransactionModal({
        title: successModalTitle,
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: transactionReceipt.transactionHash,
      });
    } catch (error) {
      let { message } = error as Error;
      if (error instanceof VError) {
        message = formatVErrorToReadableString(error);
      }
      toast.error({ message });
    }
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
              name="reason"
              leftIconName="xvs"
              disabled
              value={readableVoteWeight}
              css={styles.votingPower}
            />
            <FormikTextField
              label={t('vote.comment')}
              name="reason"
              placeholder={t('vote.addComment')}
              css={styles.comment}
            />
            <FormikSubmitButton enabledLabel={title} fullWidth loading={isVoteLoading} />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default VoteModal;
