import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    icon: css`
      display: block;
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
      margin: ${theme.spacing(0, 'auto', 6)};
      color: ${theme.palette.interactive.warning};
    `,
    title: css`
      text-align: center;
      margin-bottom: ${theme.spacing(3)};
    `,
    message: css`
      margin-bottom: ${theme.spacing(10)};
    `,
    toggleItem: css`
      display: inline-block;
      margin-right: ${theme.spacing(8)};
    `,
    toggle: css`
      margin-right: ${theme.spacing(2)};
    `,
  };
};
