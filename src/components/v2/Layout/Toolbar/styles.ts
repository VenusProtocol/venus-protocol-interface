import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return css`
    padding-top: ${theme.spacing(3)};
    padding-bottom: ${theme.spacing(3)};
    [${theme.breakpoints.up('md')}]: {
      min-height: 96;
    }
  `;
};
