/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Form, Formik } from 'formik';

import {
  ButtonWrapper,
  FormikSubmitButton,
  FormikTextField,
  Modal,
  NoticeInfo,
  PrimaryButton,
  TextButton,
} from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { displayMutationError } from 'libs/errors';
import { useTranslation } from 'libs/translations';

import addressValidationSchema from './addressValidationSchema';
import { useStyles } from './styles';

interface DelegateModalProps {
  onClose: () => void;
  isOpen: boolean;
  currentUserAccountAddress: string | undefined;
  setVoteDelegation: (input: { delegateAddress: string }) => unknown;
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

  const onSubmit = async (delegateAddress: string) => {
    try {
      await setVoteDelegation({ delegateAddress });
    } catch (error) {
      displayMutationError({ error });
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
                  className="mb-2 mt-10 w-full"
                  enabledLabel={
                    previouslyDelegated ? t('vote.redelegate') : t('vote.delegateVotes')
                  }
                  loading={isVoteDelegationLoading}
                />
              ) : (
                <PrimaryButton onClick={openAuthModal} className="mb-2 mt-10 w-full">
                  {t('connectWallet.connectButton')}
                </PrimaryButton>
              )}
            </Form>
          )}
        </Formik>

        <ButtonWrapper asChild variant="text" className="w-full hover:no-underline">
          <Link to={routes.governanceLeaderBoard.path}>{t('vote.delegateLeaderboard')}</Link>
        </ButtonWrapper>
      </>
    </Modal>
  );
};

export default DelegateModal;
