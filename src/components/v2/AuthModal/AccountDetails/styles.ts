import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      padding: ${theme.spacing(0, 5)};
      color: ${theme.palette.text.primary};
    `,
    infoContainer: css`
      display: flex;
      align-items: center;
    `,
    walletLogo: css`
      width: 48px;
      margin-right: ${theme.spacing(2)};
      flex-shrink: 0;
    `,
    infoRightColumn: css`
      flex: 1;
    `,
    walletName: css`
      display: block;
      margin-bottom: ${theme.spacing(0.5)};
      color: ${theme.palette.text.secondary};
    `,
    accountAddressContainer: css`
      width: 100%;
      display: flex;
      align-items: center;
    `,
    accountAddress: css`
      margin-right: ${theme.spacing(1)};
    `,
    copyButton: css`
      cursor: pointer;
      background-color: transparent;
      border: 0;
      padding: ${theme.spacing(0.5)};
      margin: ${theme.spacing(-0.5)};
      line-height: 0;
    `,
  };
};
