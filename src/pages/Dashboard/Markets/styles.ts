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
    collateralCell: css`
      display: flex;
      justify-content: flex-end;
      padding-right: 24px;
    `,
    loadingIcon: css`
      height: 68px;
      width: 68px;
    `,
    collateralModalContainer: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    `,
  };
};
