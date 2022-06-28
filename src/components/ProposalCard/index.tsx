/** @jsxImportSource @emotion/react */
import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { VoteSupport } from 'types';
import { Chip } from '../Chip';
import { useStyles } from './styles';

interface IProposalCardProps {
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

export const ProposalCard: React.FC<IProposalCardProps> = ({
  className,
  linkTo,
  proposalNumber,
  title,
  headerRightItem,
  headerLeftItem,
  contentRightItem,
  footer,
}) => {
  const styles = useStyles();
  return (
    <Paper
      className={className}
      css={styles.root}
      component={({ children, ...props }) => (
        <div {...props}>
          <Link to={linkTo}>{children}</Link>
        </div>
      )}
    >
      <Grid container>
        <Grid css={[styles.gridItem, styles.gridItemLeft]} item xs={12} sm={8}>
          <div css={styles.cardHeader}>
            <div>
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
    </Paper>
  );
};
