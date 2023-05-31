import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    `,
    pathNode: css`
      display: inline-flex;
      align-items: center;
    `,
    link: css`
      color: ${theme.palette.text.secondary};
      transition: color 0.3s;

      :hover {
        text-decoration: none;
        color: ${theme.palette.text.primary};
      }
    `,
    tokenSymbol: css`
      display: inline-flex;
      align-items: center;
    `,
    addTokenButton: css`
      margin-left: ${theme.spacing(4)};
      padding: ${theme.spacing(1)};
      height: auto;
      color: ${theme.palette.interactive.primary};
      background-color: ${theme.palette.background.paper};
      border-color: ${theme.palette.background.paper};

      :hover {
        color: ${theme.palette.text.primary};
      }
    `,
    walletIcon: css`
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
      margin-left: 1px;
      color: inherit;
    `,
    separator: css`
      color: ${theme.palette.text.secondary};
      margin: ${theme.spacing(0, 3)};
    `,
    address: css`
      display: inline-flex;
      align-items: center;
    `,
    copyIcon: css`
      cursor: pointer;
      display: inline-flex;
      color: ${theme.palette.interactive.primary};
      margin-left: ${theme.spacing(2)};
      height: ${theme.spacing(5.5)};
      width: auto;

      :hover {
        color: ${theme.palette.button.medium};
      }
    `,
  };
};
