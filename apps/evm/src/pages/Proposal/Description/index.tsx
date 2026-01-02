/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';

import { Card, MarkdownViewer } from 'components';
import { useTranslation } from 'libs/translations';
import type { DescriptionV1, DescriptionV2 } from 'types';
import TEST_IDS from '../testIds';

import { useStyles } from './styles';

interface DescriptionSummary {
  description: DescriptionV1 | DescriptionV2;
  className?: string;
}

export const Description: React.FC<DescriptionSummary> = ({ className, description }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Card css={styles.root} className={className} data-testid={TEST_IDS.description}>
      <div css={styles.content}>
        <Typography variant="h4" color="textSecondary">
          {t('voteProposalUi.description')}
        </Typography>

        <MarkdownViewer
          css={styles.markdown}
          className="wrap-break-word"
          content={description.description}
        />

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
      </div>
    </Card>
  );
};

export default Description;
