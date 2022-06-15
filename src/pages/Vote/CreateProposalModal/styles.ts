import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    modal: css`
      > div:first-of-type {
        margin-bottom: ${theme.spacing(8)};
      }
    `,
    formBottomMargin: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    sectionSpacing: css`
      margin-bottom: ${theme.spacing(10)};
    `,
  };
};
