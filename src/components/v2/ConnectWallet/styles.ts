import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css``,
    messageContainer: css`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${theme.spacing(4, 2)};
      border-radius: ${theme.shape.borderRadius.medium}px;
      background-color: ${theme.palette.background.default};
    `,
    icon: css`
      color: ${theme.palette.interactive.success};
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
      margin-right: ${theme.spacing(1)};
    `,
    message: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
