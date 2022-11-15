import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    mobileSelect: css`
      width: ${theme.spacing(56)};
      margin-bottom: ${theme.spacing(4)};
    `,
  };
};
