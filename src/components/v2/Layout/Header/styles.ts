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
      justify-content: space-between;
      display: flex;

      /* @TODO Remove when the ConnectButton is refactored */
      .connect-btn {
        height: auto;
        margin: ${theme.spacing(2)};
        padding: ${theme.spacing(1.5)} ${theme.spacing(2)};
        width: 165px;
      }
      ${theme.breakpoints.down('md')} {
        display: none;
      }
    `,
    rightItemPaper: css`
      margin: ${theme.spacing(2)};
      justify-content: center;
      align-items: center;
      padding: ${theme.spacing(1)};
      display: inline-flex;
    `,
    coinInfo: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: 165px;
      margin: ${theme.spacing(2)};
      padding: ${theme.spacing(1.5)} ${theme.spacing(2)};
      box-shadow: none;
      > * {
        margin-right: ${theme.spacing(1.5)};
      }
      p {
        color: ${theme.palette.text.primary};
      }
    `,
  };
};
