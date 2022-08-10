import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    backButtonTokenIcon: css`
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      margin-right: ${theme.spacing(2)};
    `,
    backButtonTokenSymbol: css`
      color: ${theme.palette.text.primary};
    `,
    address: css`
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      max-width: ${theme.spacing(50)};
    `,
    textButton: css`
      display: inline-flex;

      span {
        align-items: center;
      }
    `,
    icon: css`
      display: inline-flex;
      cursor: pointer;
      color: ${theme.palette.interactive.primary};
      margin-left: ${theme.spacing(2)};
      height: ${theme.spacing(5.5)};
      width: auto;

      :hover {
        color: ${theme.palette.button.medium};
      }
    `,
    marketDetailsLeftColumn: css`
      display: flex;
      align-items: center;
    `,
    marketDetailsAddTokenButton: css`
      margin-left: ${theme.spacing(4)};
      padding: ${theme.spacing(1)};
      color: ${theme.palette.interactive.primary};
      background-color: ${theme.palette.background.paper};
      border-color: ${theme.palette.background.paper};

      :hover {
        color: ${theme.palette.text.primary};
      }
    `,
    marketDetailsWalletIcon: css`
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
      margin-left: 1px;
      color: inherit;
    `,
  };
};
