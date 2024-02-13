/** @jsxImportSource @emotion/react */
import { FormikTextField } from 'components';
import { useTranslation } from 'libs/translations';

import { ErrorCode } from '../proposalSchema';
import { useStyles } from '../styles';

const VotingDescriptions: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <FormikTextField
        name="forDescription"
        placeholder={t('vote.createProposalForm.forOption')}
        label={t('vote.for')}
        css={styles.formBottomMargin}
        displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
      />

      <FormikTextField
        name="againstDescription"
        placeholder={t('vote.createProposalForm.againstOption')}
        label={t('vote.against')}
        css={styles.formBottomMargin}
        displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
      />

      <FormikTextField
        name="abstainDescription"
        placeholder={t('vote.createProposalForm.abstainOption')}
        label={t('vote.abstain')}
        css={styles.sectionSpacing}
        displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
      />
    </>
  );
};

export default VotingDescriptions;
