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
      padding-right: ${theme.spacing(2)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
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
      ${theme.breakpoints.down('sm')} {
        width: 100%;
      }
    `,
    countdown: css`
      > :first-of-type {
        padding-right: ${theme.spacing(3)};
        border-right: 1px solid ${theme.palette.secondary.light};
      }

      > :last-child {
        padding-left: ${theme.spacing(3)};
      }
    `,
  };
};
