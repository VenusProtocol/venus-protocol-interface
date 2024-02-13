/** @jsxImportSource @emotion/react */
import { Form, Formik } from 'formik';

import { FormikSubmitButton, FormikTextField, Modal, TextField } from 'components';
import { displayMutationError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface VoteModalProps {
  voteModalType: 0 | 1 | 2;
  handleClose: () => void;
  vote: (voteReason: string) => Promise<unknown>;
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
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  let title: string;
  switch (voteModalType) {
    case 0:
      title = t('vote.voteAgainst');
      break;
    case 1:
      title = t('vote.voteFor');
      break;
    case 2:
      title = t('vote.voteAbstain');
      break;
    // no default
  }

  const handleOnSubmit = async ({ reason }: { reason: string }) => {
    try {
      await vote(reason);
      handleClose();
    } catch (error) {
      displayMutationError({ error });
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
              className="w-full"
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
