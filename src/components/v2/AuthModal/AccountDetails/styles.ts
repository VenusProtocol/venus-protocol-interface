import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      padding: ${theme.spacing(0, 5)};
      color: ${theme.palette.text.primary};

      ${theme.breakpoints.down('md')} {
        text-align: center;
      }
    `,
    infoContainer: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(2)};

      ${theme.breakpoints.down('md')} {
        display: block;
        margin-bottom: ${theme.spacing(3)};
      }
    `,
    walletLogo: css`
      width: 48px;
      margin-right: ${theme.spacing(2)};
      flex-shrink: 0;

      ${theme.breakpoints.down('md')} {
        margin-right: 0;
        margin-bottom: ${theme.spacing(1)};
      }
    `,
    infoRightColumn: css`
      flex: 1;
    `,
    walletName: css`
      display: block;
      margin-bottom: ${theme.spacing(0.5)};
      color: ${theme.palette.text.secondary};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(2)};
      }
    `,
    accountAddressContainer: css`
      width: 100%;
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('md')} {
        justify-content: center;
      }
    `,
    accountAddress: css`
      margin-right: ${theme.spacing(1)};
      display: block;

      ${theme.breakpoints.down('md')} {
        display: none;
      }
    `,
    accountAddressMobile: css`
      margin-right: ${theme.spacing(1)};
      display: none;

      ${theme.breakpoints.down('md')} {
        display: block;
      }
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
      display: inline-block;
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

      ${theme.breakpoints.down('md')} {
        margin: 0 auto ${theme.spacing(4)};
      }
    `,
    bscScanLinkText: css`
      display: flex;
      align-items: center;
      color: inherit;
    `,
    bscScanLinkIcon: css`
      color: inherit;
      margin-left: ${theme.spacing(1)};
    `,
  };
};
