import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return css`
    padding-top: ${theme.spacing(3)};
    padding-bottom: ${theme.spacing(3)};
    [${theme.breakpoints.down('md')}]: {
      min-height: none;
    }
  `;
};
