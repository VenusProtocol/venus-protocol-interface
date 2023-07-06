import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    button: css`
      padding: 0;
      height: auto;
      color: ${theme.palette.interactive.error};

      :hover:not(:disabled) {
        color: ${theme.palette.interactive.error50};
      }

      svg {
        transition: inherit;
        color: inherit;
        margin-left: ${theme.spacing(2)};
      }
    `,
    buttonIcon: css`
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
    `,
  };
};
