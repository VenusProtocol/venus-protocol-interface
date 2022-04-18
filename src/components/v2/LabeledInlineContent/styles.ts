import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    `,
    column: css`
      display: flex;
      align-items: center;
    `,
    icon: css`
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
      margin-top: -2px;
      margin-right: ${theme.spacing(2)};
    `,
    label: css`
      color: ${theme.palette.text.secondary};
    `,
  };
};
