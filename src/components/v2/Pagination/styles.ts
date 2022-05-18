import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
    `,
    button: css`
      background-color: ${theme.palette.background.paper};
      color: ${theme.palette.text.primary};
    `,
    getButtonStyles: ({ isActive }: { isActive: boolean }) => css`
      color: ${isActive ? theme.palette.text.primary : theme.palette.text.secondary};
    `,
    arrowButtonWrapper: css`
      display: flex;
      align-items: center;
      line-height: 1px;
    `,
  };
};
