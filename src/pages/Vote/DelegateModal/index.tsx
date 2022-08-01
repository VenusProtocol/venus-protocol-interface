/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import {
  FormikSubmitButton,
  FormikTextField,
  Modal,
  NoticeInfo,
  PrimaryButton,
  TextButton,
  toast,
} from 'components';
import { Form, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';

import Path from 'constants/path';

import addressValidationSchema from './addressValidationSchema';
import { useStyles } from './styles';

interface DelegateModalProps {
  onClose: () => void;
  isOpen: boolean;
  currentUserAccountAddress: string | undefined;
  setVoteDelegation: (address: string) => void;
  previouslyDelegated: boolean;
  isVoteDelegationLoading: boolean;
  openAuthModal: () => void;
}

const DelegateModal: React.FC<DelegateModalProps> = ({
  onClose,
  isOpen,
  currentUserAccountAddress,
  setVoteDelegation,
  previouslyDelegated,
  isVoteDelegationLoading,
  openAuthModal,
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
      isOpen={isOpen}
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
          isInitialValid={false}
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
                  disabled={!currentUserAccountAddress}
                >
                  {t('vote.pasteYourAddress')}
                </TextButton>
              </div>
              <FormikTextField
                placeholder={t('vote.enterContactAddress')}
                name="address"
                maxLength={42}
                disabled={!currentUserAccountAddress}
              />
              {currentUserAccountAddress ? (
                <FormikSubmitButton
                  fullWidth
                  enabledLabel={
                    previouslyDelegated ? t('vote.redelegate') : t('vote.delegateVotes')
                  }
                  css={styles.submitButton}
                  loading={isVoteDelegationLoading}
                />
              ) : (
                <PrimaryButton onClick={openAuthModal} css={styles.submitButton} fullWidth>
                  {t('connectWallet.connectButton')}
                </PrimaryButton>
              )}
            </Form>
          )}
        </Formik>
        <Link css={styles.link} to={Path.GOVERNANCE_LEADER_BOARD}>
          {t('vote.delegateLeaderboard')}
        </Link>
      </>
    </Modal>
  );
};

export default DelegateModal;
