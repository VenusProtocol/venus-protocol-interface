import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    button: css`
      border-color: ${theme.palette.background.paper};

      > span {
        display: flex;
        align-items: center;
      }
    `,
    icon: css`
      margin-left: ${theme.spacing(2)};
      margin-right: ${theme.spacing(2)};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
    `,
  };
};
