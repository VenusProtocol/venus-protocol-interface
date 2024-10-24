/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';

import { Card, MarkdownViewer } from 'components';
import { ReadableActionSignature } from 'containers/ReadableActionSignature';
import { useTranslation } from 'libs/translations';
import type { DescriptionV1, DescriptionV2, ProposalAction } from 'types';
import TEST_IDS from '../testIds';

import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useStyles } from './styles';

interface DescriptionSummary {
  description: DescriptionV1 | DescriptionV2;
  actions: ProposalAction[];
  className?: string;
}

export const Description: React.FC<DescriptionSummary> = ({ className, description, actions }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const isMultichainGovernanceFeatureEnabled = useIsFeatureEnabled({
    name: 'multichainGovernance',
  });

  return (
    <Card css={styles.root} className={className} data-testid={TEST_IDS.description}>
      <div css={styles.content}>
        <Typography variant="h4" color="textSecondary">
          {t('voteProposalUi.description')}
        </Typography>

        <MarkdownViewer css={styles.markdown} content={description.description} />

        {description.version === 'v2' && (
          <>
            <Typography variant="h4" color="textSecondary" css={styles.section}>
              {t('voteProposalUi.votingOptions')}
            </Typography>

            <ul css={styles.votingOptionList}>
              <li>
                {t('vote.for')} - {description.forDescription}
              </li>

              <li>
                {t('vote.against')} - {description.againstDescription}
              </li>

              <li>
                {t('vote.abstain')} - {description.abstainDescription}
              </li>
            </ul>
          </>
        )}

        {!isMultichainGovernanceFeatureEnabled && (
          <>
            <Typography variant="h4" color="textSecondary" css={styles.section}>
              {t('voteProposalUi.operation')}
            </Typography>

            {actions.map(action => (
              <ReadableActionSignature
                key={`readable-action-signature-${action.signature}-${action.target}-${action.value}-${action.callData}`}
                action={action}
              />
            ))}
          </>
        )}
      </div>
    </Card>
  );
};

export default Description;
