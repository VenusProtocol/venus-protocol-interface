import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    signature: css`
      color: ${theme.palette.text.primary};
      overflow-wrap: anywhere;

      > a {
        color: ${theme.palette.interactive.success};
        :hover {
          color: ${theme.palette.interactive.success50};
        }
      }
    `,
  };
};
