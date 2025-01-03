/** @jsxImportSource @emotion/react */
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Card } from 'components';

import { Link } from 'containers/Link';
import type { VoteSupport } from 'types';

import { Chip } from '../../components/Chip';
import { useStyles } from './styles';

interface ProposalCardProps {
  className?: string;
  linkTo: string;
  proposalNumber: number;
  title: string;
  userVoteStatus?: VoteSupport;
  headerRightItem?: React.ReactElement;
  headerLeftItem?: React.ReactElement;
  contentRightItem: React.ReactElement;
  footer?: React.ReactElement;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  className,
  linkTo,
  proposalNumber,
  title,
  headerRightItem,
  headerLeftItem,
  contentRightItem,
  footer,
  ...containerProps
}) => {
  const styles = useStyles();

  return (
    <Card className={className} css={styles.root} asChild {...containerProps}>
      <Link css={styles.link} to={linkTo}>
        <Grid container>
          <Grid css={[styles.gridItem, styles.gridItemLeft]} item xs={12} sm={8}>
            <div css={styles.cardHeader}>
              <div css={styles.cardHeaderLeft}>
                <Chip text={`#${proposalNumber}`} />
                {headerLeftItem}
              </div>

              {headerRightItem}
            </div>

            <Typography variant="h4" css={styles.cardTitle} color="textPrimary">
              {title}
            </Typography>

            {footer}
          </Grid>
          <Grid css={[styles.gridItem, styles.gridItemRight]} item xs={12} sm={4}>
            {contentRightItem}
          </Grid>
        </Grid>
      </Link>
    </Card>
  );
};
