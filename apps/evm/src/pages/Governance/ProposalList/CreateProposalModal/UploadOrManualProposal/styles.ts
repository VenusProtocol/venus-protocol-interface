import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    fileInput: css`
      display: none;
    `,
    options: css`
      display: flex;
      gap: ${theme.spacing(3)};
      margin-bottom: ${theme.spacing(6)};
      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    option: css`
      flex: 1;
    `,
  };
};
