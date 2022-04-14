import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({ increase }: { increase: boolean }) => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
    `,
    icon: css`
      color: ${increase ? theme.palette.interactive.success : theme.palette.interactive.error};
      margin: 0 ${theme.spacing(2.5)};
      width: ${theme.shape.iconSize.medium}px;
      height: ${theme.shape.iconSize.medium}px;
    `,
  };
};
