import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    arrow: (inverted: boolean) => css`
      margin-right: ${theme.spacing(4.5)};
      ${inverted && 'transform: rotate(180deg)'};
    `,
    iconButton: css`
      cursor: pointer;
      background-color: transparent;
      border: 0;
      display: flex;
      align-items: center;
    `,
    accordionRoot: css`
      padding: 0;
      margin-bottom: ${theme.spacing(7)};
      ::before {
        display: none;
      }
      &.Mui-expanded {
        margin: 0;
      }
    `,
    accordionSummary: css`
      display: flex;
      flex-direction: row;
      min-height: 0 !important;
      > div {
        margin: 0 !important;
        justify-content: space-between;
      }
      margin: 0;
    `,
    accordionLeft: css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `,
    formTopMargin: css`
      margin-top: ${theme.spacing(2)};
    `,
    formBottomMargin: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    addOneMore: css`
      margin: ${theme.spacing(8)} 0;
    `,
  };
};
