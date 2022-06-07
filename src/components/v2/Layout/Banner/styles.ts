import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    banner: css`
      margin: ${theme.spacing(4, 10, 0)};
      ${theme.breakpoints.down('lg')} {
        margin: ${theme.spacing(6, 6, 0)};
      }
      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(4, 4, 0)};
      }
    `,
    bannerLink: css`
      color: ${theme.palette.text.primary};
      text-decoration: underline;
    `,
  };
};
