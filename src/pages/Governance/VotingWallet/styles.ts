import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    clickableText: css`
      color: ${theme.palette.interactive.primary};

      :hover {
        text-decoration: underline;
        cursor: pointer;
      }
    `,
    votingWeightContainer: css`
      padding-bottom: ${theme.spacing(4)};
      ${theme.breakpoints.down('lg')} {
        border-right: 1px solid ${theme.palette.interactive.delimiter};
        padding-right: ${theme.spacing(10)};
        padding-bottom: 0;
      }
      ${theme.breakpoints.down('sm')} {
        border-right: none;
        padding-bottom: ${theme.spacing(4)};
      }
    `,
    tokenIcon: css`
      height: ${theme.spacing(6.5)};
      width: ${theme.spacing(6.5)};
      margin-right: ${theme.spacing(3)};
    `,
    voteSection: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${theme.spacing(6)};
      ${theme.breakpoints.down('lg')} {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
    `,
    votingWalletPaper: css`
      display: flex;
      flex-direction: column;
      margin-top: ${theme.spacing(6)};
      ${theme.breakpoints.down('lg')} {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
    `,
    infoIcon: css`
      align-self: center;
    `,
  };
};
