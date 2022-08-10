import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  const gap = theme.spacing(8);

  return {
    row: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: ${gap};
    `,
  };
};
