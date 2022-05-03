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

      ${theme.breakpoints.down('xl')} {
        flex-direction: column;
        margin-bottom: 0;
      }
    `,
    column: css`
      width: calc(50% - ${gap} / 2);

      ${theme.breakpoints.down('xl')} {
        width: 100%;
        margin-bottom: ${gap};
      }
    `,
  };
};
