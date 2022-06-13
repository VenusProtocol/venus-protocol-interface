import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    modal: css`
      > div {
        margin-bottom: ${theme.spacing(8)};
      }
    `,
    sectionSpacing: css`
      margin-bottom: ${theme.spacing(10)};
    `,
  };
};
