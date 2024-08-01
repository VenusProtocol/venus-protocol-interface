import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    signature: css`
    font-size: inherit;
      color: ${theme.palette.text.primary};
      overflow-wrap: anywhere;

      > a {
        font-size: inherit;
        color: ${theme.palette.interactive.success};
        :hover {
          color: ${theme.palette.interactive.success50};
        }
      }
    `,
  };
};
