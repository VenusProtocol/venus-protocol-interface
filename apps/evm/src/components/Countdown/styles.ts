import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    activeUntilDate: css`
      padding-left: ${theme.spacing(1)};
    `,
  };
};
