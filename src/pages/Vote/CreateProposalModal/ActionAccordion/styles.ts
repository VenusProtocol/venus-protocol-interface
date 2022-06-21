import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    accordion: css`
      :last-of-type {
        margin-bottom: 0;
      }
      .MuiAccordionDetails-root {
        :last-of-type {
          margin-bottom: 0;
        }
      }
    `,
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
    closeIcon: css`
      height: ${theme.spacing(3)};
      width: ${theme.spacing(3)};
      margin: -${theme.spacing(1.5)};
    `,
  };
};
