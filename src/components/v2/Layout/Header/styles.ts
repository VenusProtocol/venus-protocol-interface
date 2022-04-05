import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    appBar: css`
      background-image: none;
      background-color: transparent;
      box-shadow: none;
    `,
    toolbar: css`
      padding: ${theme.spacing(4, 5, 0)} !important;
      justify-content: space-between;
      display: flex;

      ${theme.breakpoints.down('lg')} {
        padding-left: ${theme.spacing(3)} !important;
        padding-right: ${theme.spacing(3)} !important;
      }

      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(3, 2, 0)} !important;
      }
    `,
    rightItemContainer: css`
      ${theme.breakpoints.down('md')} {
        display: none;
      }
    `,
    rightItemPaper: css`
      margin-right: ${theme.spacing(1.5)};
      align-items: center;
      padding: ${theme.spacing(1)};
      display: inline-flex;
      min-width: 165px;
      box-shadow: none;
      border-radius: ${theme.shape.borderRadius.small}px;
      :last-child {
        margin-right: 0;
      }
      :nth-last-child(2) {
        margin-right: ${theme.spacing(3)};
      }
      ${theme.breakpoints.down('lg')} {
        min-width: 140px;
      }
    `,
  };
};
