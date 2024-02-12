import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    topProgressBarLegend: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${theme.spacing(3)};
    `,
    inlineContainer: css`
      display: flex;

      ${theme.breakpoints.down('md')} {
        flex-direction: column;

        :last-of-type {
          text-align: right;
        }
      }
    `,
    inlineLabel: css`
      margin-right: ${theme.spacing(1)};

      ${theme.breakpoints.down('md')} {
        margin-right: 0;
      }
    `,
    inlineValue: css`
      color: ${theme.palette.text.primary};
    `,
    leftColumn: css`
      margin-right: ${theme.spacing(6)};
    `,
  };
};
