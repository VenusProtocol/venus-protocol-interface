import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      justify-content: space-between;
    `,
    column: css`
      :not(:last-child) {
        margin-right: ${theme.spacing(6)};
      }
    `,
    contentColumn: css`
      max-width: ${theme.spacing(175)};
    `,
    header: css`
      display: flex;
      margin-bottom: ${theme.spacing(6)};
    `,
    primeLogo: css`
      display: block;
      width: ${theme.spacing(10)};
      margin-right: ${theme.spacing(4)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    greenText: css`
      color: ${theme.palette.interactive.success};
    `,
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    stakeButton: css`
      white-space: nowrap;
    `,
    progress: css`
      width: ${theme.spacing(125)};
      padding-left: ${theme.spacing(14)};
    `,
    progressBar: css`
      margin-bottom: ${theme.spacing(2)};
    `,
  };
};
