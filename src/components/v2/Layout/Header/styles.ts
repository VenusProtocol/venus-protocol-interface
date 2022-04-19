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
      padding: ${theme.spacing(8, 10, 0)} !important;
      justify-content: space-between;
      display: flex;

      ${theme.breakpoints.down('lg')} {
        padding-left: ${theme.spacing(6)} !important;
        padding-right: ${theme.spacing(6)} !important;
      }

      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(6, 4, 0)} !important;
      }
    `,
    rightItemPaper: css`
      margin-right: ${theme.spacing(3)};
      align-items: center;
      padding: ${theme.spacing(2)};
      display: inline-flex;
      min-width: ${theme.spacing(41)};
      box-shadow: none;
      border-radius: ${theme.shape.borderRadius.small}px;
      :last-child {
        margin-right: 0;
      }
      :nth-last-child(2) {
        margin-right: ${theme.spacing(6)};
      }
      ${theme.breakpoints.down('lg')} {
        min-width: ${theme.spacing(35)};
      }
    `,
  };
};
