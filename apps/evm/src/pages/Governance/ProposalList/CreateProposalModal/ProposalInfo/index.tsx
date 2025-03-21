/** @jsxImportSource @emotion/react */
import { useTranslation } from 'libs/translations';
import { ProposalType } from 'types';

import { FormikMarkdownEditor, FormikSelectField, FormikTextField } from 'containers/Form';
import { ErrorCode } from '../proposalSchema';
import { useStyles } from '../styles';

const ProposalInfo: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <FormikSelectField
        name="proposalType"
        label={t('vote.createProposalForm.proposalType')}
        css={styles.formBottomMargin}
        className="w-full"
        variant="secondary"
        options={[
          { value: ProposalType.NORMAL, label: t('vote.proposalType.normal') },
          { value: ProposalType.FAST_TRACK, label: t('vote.proposalType.fastTrack') },
          { value: ProposalType.CRITICAL, label: t('vote.proposalType.critical') },
        ]}
      />

      <FormikTextField
        name="title"
        placeholder={t('vote.createProposalForm.name')}
        label={t('vote.createProposalForm.proposalName')}
        css={styles.formBottomMargin}
        displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
      />

      <FormikMarkdownEditor
        name="description"
        placeholder={t('vote.createProposalForm.addDescription')}
        label={t('vote.createProposalForm.description')}
        css={styles.sectionSpacing}
        displayableErrorCodes={[ErrorCode.VALUE_REQUIRED]}
      />
    </>
  );
};

export default ProposalInfo;
