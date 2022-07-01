import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      flex-direction: column;
    `,
    title: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    value: css`
      margin-top: ${theme.spacing(1)};
    `,
    delimiter: css`
      margin: ${theme.spacing(6)} 0;
    `,
    voteSection: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `,
    delegateSection: css`
      display: inline-flex;
      flex-direction: row;
      align-items: center;
    `,
    progressBarTitle: css`
      margin-left: ${theme.spacing(1)};
      margin-top: ${theme.spacing(1)};
    `,
  };
};
