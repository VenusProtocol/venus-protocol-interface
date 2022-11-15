import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      position: relative;
      margin-bottom: ${theme.spacing(12)};
    `,
    content: css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('md')} {
        display: block;
      }
    `,
    icon: css`
      width: ${theme.spacing(19)};
      height: auto;
      margin-right: ${theme.spacing(6)};
      flex-shrink: 0;

      ${theme.breakpoints.down('md')} {
        display: block;
        margin: 0 auto ${theme.spacing(4)};
      }
    `,
    textContainer: css`
      max-width: ${theme.spacing(175)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    closeButton: css`
      cursor: pointer;
      position: absolute;
      top: ${theme.spacing(3)};
      right: ${theme.spacing(3)};
      padding: ${theme.spacing(1)};
      background: none;
      border: 0;
      margin: 0;
    `,
  };
};
