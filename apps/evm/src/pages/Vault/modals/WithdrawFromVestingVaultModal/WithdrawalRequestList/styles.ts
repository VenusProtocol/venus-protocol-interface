import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    listItem: css`
      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
  };
};
