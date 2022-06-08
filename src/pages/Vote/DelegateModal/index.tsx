/** @jsxImportSource @emotion/react */
import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { Typography } from '@mui/material';
import { Modal, NoticeInfo, FormikSubmitButton, FormikTextField, TextButton } from 'components';
import Path from 'constants/path';
import { useTranslation } from 'translation';
import addressValidationSchema from './addressValidationSchema';
import { useStyles } from './styles';

interface IDelegateModalProps {
  onClose: () => void;
  isOpen: boolean;
  currentUserAccountAddress: string;
}

const DelegateModal: React.FC<IDelegateModalProps> = ({
  onClose,
  isOpen,
  currentUserAccountAddress,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const handleSubmit = () => {};
  return (
    <Modal isOpened={isOpen} handleClose={onClose} title={t('vote.delegateVoting')}>
      <>
        <NoticeInfo
          title={t('vote.pleasePayAttention')}
          description={t('vote.youCanDelegateVotes')}
        />
        <Formik
          initialValues={{
            address: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={addressValidationSchema}
          validateOnMount
          validateOnChange
        >
          {({ setFieldValue }) => (
            <>
              <div css={styles.inputLabels}>
                <Typography>{t('vote.delegateAddress')}</Typography>
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
                enabledLabel={t('vote.delgateVotes')}
                css={styles.submitButton}
              />
            </>
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
