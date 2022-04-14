import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
    `,
    icon: css`
      margin-top: -2px;
      margin-right: ${theme.spacing(2)};
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
    `,
  };
};
