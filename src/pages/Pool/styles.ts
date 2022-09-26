import { css } from '@emotion/react';
import { alpha, useTheme } from '@mui/material';

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
    banner: css`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${theme.spacing(6)};
      border-radius: ${theme.shape.borderRadius.small}px;
      border: 1px solid ${theme.palette.interactive.warning};
      background-color: ${alpha(theme.palette.interactive.warning as string, 0.1)};
      margin-bottom: ${theme.spacing(8)};
    `,
    bannerContent: css`
      display: flex;
      align-items: center;
      margin: 0 auto;
    `,
    bannerText: css`
      color: ${theme.palette.text.primary};

      a {
        color: ${theme.palette.interactive.primary};
      }

      a:hover {
        text-decoration: underline;
      }
    `,
    bannerIcon: css`
      flex-shrink: 0;
      color: ${theme.palette.interactive.warning};
      margin-right: ${theme.spacing(2)};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
    `,
  };
};
