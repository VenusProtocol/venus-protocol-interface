import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    column: css`
      display: flex;
      align-items: center;
    `,
    icon: css`
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
      margin-right: ${theme.spacing(1)};
    `,
    value: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
