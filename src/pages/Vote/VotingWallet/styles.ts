import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      flex: 1;
      margin-left: ${theme.spacing(4)};
    `,
    clickableText: css`
      color: ${theme.palette.interactive.primary};
      :hover {
        color: ${theme.palette.text.primary};
        cursor: pointer;
      }
    `,
    votingWeightContainer: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    totalLockedContainer: css`
      margin: ${theme.spacing(4)} 0 ${theme.spacing(5)} 0;
    `,
    tokenIcon: css`
      height: ${theme.spacing(6.5)};
      width: ${theme.spacing(6.5)};
    `,
    totalLockedValue: css`
      display: flex;
      flex-direction: row;
      padding-bottom: ${theme.spacing(2)};
    `,
    voteSection: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${theme.spacing(6)};
    `,
    subtitle: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    votingWalletPaper: css`
      margin-top: ${theme.spacing(6)};
    `,
    toVote: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    depositTokens: css`
      margin-bottom: ${theme.spacing(3)};
    `,
  };
};
