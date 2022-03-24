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
      margin-bottom: ${theme.spacing(2)};
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

      :hover > svg {
        color: ${theme.palette.button.dark};
      }

      :active > svg {
        color: ${theme.palette.button.light};
      }
    `,
    copyButtonIcon: css`
      color: ${theme.palette.button.main};
      width: 24px;
      height: 24px;
      transition: color 0.3s;
    `,
    bscScanLinkContainer: css`
      display: flex;
      align-items: center;
      color: ${theme.palette.button.main};
      margin-left: ${theme.spacing(8)};
      margin-bottom: ${theme.spacing(5)};

      :hover > a,
      :hover > svg {
        color: ${theme.palette.button.dark};
      }

      :active > a,
      :active > svg {
        color: ${theme.palette.button.light};
      }
    `,
    bscScanLinkText: css`
      color: inherit;
      margin-right: ${theme.spacing(1)};
    `,
    bscScanLinkIcon: css`
      color: inherit;
    `,
  };
};
