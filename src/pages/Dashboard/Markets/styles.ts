import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      width: 100%;
      background-color: ${theme.palette.background.paper};
      border-radius: ${theme.shape.borderRadius.large}px;
      padding: ${theme.spacing(3, 0, 1)};
    `,
    tokenCell: css`
      display: flex;
      align-items: center;
    `,
    tokenCellIcon: css`
      margin-right: ${theme.spacing(1)};
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
    `,
    collateralCell: css`
      display: flex;
      justify-content: flex-end;
      padding-right: 24px;
    `,
  };
};
