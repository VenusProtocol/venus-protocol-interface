import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      flex-direction: row;
      padding: 0;
      ${theme.breakpoints.down('lg')} {
        flex-direction: column;
      }
    `,
    leftSection: css`
      display: flex;
      flex-direction: column;
      flex: 3;
      border-right: ${theme.spacing(0.25)} solid ${theme.palette.secondary.light};
      padding: ${theme.spacing(6)};

      ${theme.breakpoints.down('lg')} {
        border-right: none;
      }
    `,
    topRow: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: ${theme.spacing(6)};
      align-items: center;
    `,
    rightSection: css`
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-left: ${theme.spacing(6)};
      padding: ${theme.spacing(6)};
      ${theme.breakpoints.down('lg')} {
        border-top: ${theme.spacing(0.25)} solid ${theme.palette.secondary.light};
        margin-left: 0;
      }
    `,
    chipSpace: css`
      margin-right: ${theme.spacing(2)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    countdownLabel: css`
      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    countdown: css`
      margin-left: ${theme.spacing(3)};
      padding-left: ${theme.spacing(3)};
      border-left: ${theme.spacing(0.25)} solid ${theme.palette.secondary.light};

      ${theme.breakpoints.down('sm')} {
        border-left: 0;
      }
    `,
    transactionLink: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    content: css`
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    `,
    rightTitle: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    updateProposalButton: css`
      min-width: ${theme.spacing(58)};
      margin-top: ${theme.spacing(8)};
      ${theme.breakpoints.down('sm')} {
        width: 100%;
      }
    `,
  };
};
