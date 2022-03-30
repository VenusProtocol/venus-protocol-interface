import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    appBar: css`
      background-image: none;
      background-color: transparent;
      box-shadow: none;
      ${theme.breakpoints.down('md')} {
        display: none;
      }
    `,
    toolbar: css`
      padding-top: ${theme.spacing(4.25)};
      padding-bottom: 0;
      justify-content: space-between;
      display: flex;
    `,
    rightItemPaper: css`
      margin-right: ${theme.spacing(1.333)};
      align-items: center;
      padding: ${theme.spacing(1)};
      display: inline-flex;
      min-width: 165px;
      box-shadow: none;
      border-radius: ${theme.shape.borderRadius.small}px;
      :last-child {
        margin-right: 0;
      }
      ${theme.breakpoints.down('lg')} {
        min-width: 140px;
      }
    `,
  };
};
