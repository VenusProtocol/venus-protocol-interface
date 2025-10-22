import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    buttonsContainer: css`
      display: flex;
      align-items: center;
      width: 100%;

      > button {
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
      }

      ${theme.breakpoints.down('sm')} {
        width: 100%;
      }
    `,
  };
};
