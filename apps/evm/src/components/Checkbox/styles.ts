import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      padding: 0;

      svg {
        height: ${theme.spacing(5)};
        width: ${theme.spacing(5)};
      }
      :hover {
        svg {
          color: ${theme.palette.interactive.primary};
        }
      }
    `,
  };
};

export default useStyles;
