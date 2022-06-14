/** @jsxImportSource @emotion/react */
import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Typography } from '@mui/material';
import {
  toast,
  Modal,
  NoticeInfo,
  FormikSubmitButton,
  FormikTextField,
  TextButton,
} from 'components';
import Path from 'constants/path';
import { useTranslation } from 'translation';
import addressValidationSchema from './addressValidationSchema';
import { useStyles } from './styles';

interface IDelegateModalProps {
  onClose: () => void;
  isOpen: boolean;
  currentUserAccountAddress: string | undefined;
  setVoteDelegation: (address: string) => void;
  previouslyDelegated: boolean;
  isVoteDelegationLoading: boolean;
}

const DelegateModal: React.FC<IDelegateModalProps> = ({
  onClose,
  isOpen,
  currentUserAccountAddress,
  setVoteDelegation,
  previouslyDelegated,
  isVoteDelegationLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const onSubmit = async (address: string) => {
    try {
      await setVoteDelegation(address);
    } catch (error) {
      const { message } = error as Error;
      toast.error({
        message,
      });
    }
  };

  return (
    <Modal
      isOpened={isOpen}
      handleClose={onClose}
      title={previouslyDelegated ? t('vote.redelegateVoting') : t('vote.delegateVoting')}
    >
      <>
        <NoticeInfo
          title={t('vote.pleasePayAttention')}
          description={t('vote.youCanDelegateVotes')}
        />
        <Formik
          initialValues={{
            address: '',
          }}
          onSubmit={({ address }) => onSubmit(address)}
          validationSchema={addressValidationSchema}
          validateOnMount
          validateOnChange
        >
          {({ setFieldValue }) => (
            <Form>
              <div css={styles.inputLabels}>
                <Typography color="textPrimary">{t('vote.delegateAddress')}</Typography>
                <TextButton
                  css={styles.inline}
                  onClick={() => setFieldValue('address', currentUserAccountAddress)}
                >
                  {t('vote.pasteYourAddress')}
                </TextButton>
              </div>
              <FormikTextField
                placeholder={t('vote.enterContactAddress')}
                name="address"
                maxLength={42}
              />
              <FormikSubmitButton
                fullWidth
                enabledLabel={previouslyDelegated ? t('vote.redelegate') : t('vote.delgateVotes')}
                css={styles.submitButton}
                loading={isVoteDelegationLoading}
              />
            </Form>
          )}
        </Formik>
        <Link css={styles.link} to={Path.VOTE_LEADER_BOARD}>
          {t('vote.delegateLeaderboard')}
        </Link>
      </>
    </Modal>
  );
};

export default DelegateModal;
