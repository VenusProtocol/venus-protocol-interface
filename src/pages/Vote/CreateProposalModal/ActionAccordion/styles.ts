import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    iconButton: css`
      cursor: pointer;
      background-color: transparent;
      border: 0;
      display: flex;
      align-items: center;
    `,
    formTopMargin: css`
      margin-top: ${theme.spacing(2)};
    `,
    formBottomMargin: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    addOneMore: css`
      margin: ${theme.spacing(10)} 0;
    `,
    addTopMargin: (add: boolean) => css`
      ${add && `margin-top: ${theme.spacing(2)}`};
    `,
  };
};
