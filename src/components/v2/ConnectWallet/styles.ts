import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    prompt: css`
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${theme.shape.borderRadius.medium}px;
      background-color: ${theme.palette.background.default};
      padding: ${theme.spacing(8, 4)};
      margin-bottom: ${theme.spacing(10)};
    `,
    icon: css`
      color: ${theme.palette.interactive.success};
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
      margin-right: ${theme.spacing(2)};
    `,
    message: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
