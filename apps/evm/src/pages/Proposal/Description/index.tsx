/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

import { MarkdownViewer } from 'components';
import { ReadableActionSignature } from 'containers/ReadableActionSignature';
import { useTranslation } from 'libs/translations';
import type { DescriptionV1, DescriptionV2, ProposalAction, Token } from 'types';

import { useStyles } from './styles';

interface DescriptionSummary {
  description: DescriptionV1 | DescriptionV2;
  actions: ProposalAction[];
  tokens: Token[];
  className?: string;
}

export const Description: React.FC<DescriptionSummary> = ({
  className,
  description,
  actions,
  tokens,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Paper css={styles.root} className={className}>
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
        <Typography variant="h4" color="textSecondary" css={styles.section}>
          {t('voteProposalUi.operation')}
        </Typography>

        {actions.map(action => (
          <ReadableActionSignature
            key={`readable-action-signature-${action.signature}-${action.target}-${action.value}-${action.callData}`}
            action={action}
            tokens={tokens}
          />
        ))}
      </div>
    </Paper>
  );
};

export default Description;
