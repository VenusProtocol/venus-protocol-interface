import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    header: css`
      flex: 1;
      margin-bottom: ${theme.spacing(6)};
    `,
    headerDescription: css`
      margin-right: ${theme.spacing(6)};
      color: ${theme.palette.text.primary};
      flex: 1;

      ${theme.breakpoints.down('xxl')} {
        display: block;
      }
    `,
    poolWarning: css`
      margin-bottom: ${theme.spacing(6)};
    `,
  };
};
