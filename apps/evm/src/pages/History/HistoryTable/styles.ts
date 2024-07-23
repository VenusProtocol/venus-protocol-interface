import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    txnHashText: css`
      text-decoration: underline;
      align-items: center;
      color: ${theme.palette.text.primary};
      padding: 0 !important;

      :hover {
        color: ${theme.palette.button.medium};
      }

      :active {
        color: ${theme.palette.button.dark};
      }
    `,
    typeCol: css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `,
    cardTitle: css`
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      ${theme.breakpoints.down('xl')} {
        display: flex;
      }
    `,
    icon: css`
      flex-shrink: 0;
      margin-top: -2px;
      margin-right: ${theme.spacing(2)};
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
    `,
  };
};
