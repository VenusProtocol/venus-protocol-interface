import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    header: css`
      margin-bottom: ${theme.spacing(8)};
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('xxl')} {
        margin-bottom: ${theme.spacing(6)};
        display: block;
      }
    `,
    headerDescription: css`
      margin-right: ${theme.spacing(6)};
      color: ${theme.palette.text.primary};
      flex: 1;

      ${theme.breakpoints.down('xxl')} {
        margin-bottom: ${theme.spacing(6)};
        display: block;
      }
    `,
    isolatedPoolWarning: css`
      margin-bottom: ${theme.spacing(8)};

      ${theme.breakpoints.down('xxl')} {
        margin-bottom: ${theme.spacing(6)};
      }
    `,
  };
};
