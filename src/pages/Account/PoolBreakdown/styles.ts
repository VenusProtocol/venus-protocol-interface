import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    title: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(4)};
    `,
    marketName: css`
      margin-right: ${theme.spacing(3)};
    `,
    statsContainer: css`
      display: flex;
      justify-content: space-between;
      margin-bottom: ${theme.spacing(6)};

      ${theme.breakpoints.down('xl')} {
        display: block;
        padding: 0;
        background-color: transparent;
      }

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(10)};
      }
    `,
    getNetApyColor: ({ netApyPercentage }: { netApyPercentage: number }) =>
      netApyPercentage > 0 ? theme.palette.interactive.success : theme.palette.interactive.error,
    cellGroup: css`
      padding: 0;

      ${theme.breakpoints.down('xl')} {
        margin-bottom: ${theme.spacing(2)};
      }
    `,
    accountHealth: css`
      ${theme.breakpoints.down('xl')} {
        padding: ${theme.spacing(4)};
        background-color: ${theme.palette.background.paper};
        border-radius: ${theme.shape.borderRadius.large}px;
      }
    `,
    accountHealthProgressBar: css`
      margin-bottom: ${theme.spacing(3)};
    `,
    accountHealthFooter: css`
      display: flex;
      justify-content: flex-end;
      align-items: center;
    `,
    tooltip: css`
      display: flex;
    `,
    infoIcon: css`
      cursor: help;
    `,
    inlineLabel: css`
      margin-right: ${theme.spacing(1)};
    `,
    progressBar: css`
      margin-bottom: ${theme.spacing(3)};
    `,
    shieldIcon: css`
      margin-right: ${theme.spacing(2)};
    `,
    safeLimit: css`
      margin-right: ${theme.spacing(2)};
    `,
  };
};
