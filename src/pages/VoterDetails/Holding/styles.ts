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
      line-height: 1.25rem;
    `,
    delimiter: css`
      margin: ${theme.spacing(5)} 0;
    `,
    progressBarTitle: css`
      margin-left: ${theme.spacing(1)};
      font-size: ${theme.typography.h4.fontSize};
    `,
  };
};
