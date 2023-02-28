import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      color: ${theme.palette.text.primary};

      ${theme.breakpoints.down('md')} {
        text-align: center;
      }
    `,
    infoContainer: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(4)};

      ${theme.breakpoints.down('md')} {
        display: block;
        margin-bottom: ${theme.spacing(6)};
      }
    `,
    walletLogo: css`
      width: ${theme.spacing(12)};
      height: auto;
      margin-right: ${theme.spacing(4)};
      flex-shrink: 0;

      ${theme.breakpoints.down('md')} {
        margin-right: 0;
        margin-bottom: ${theme.spacing(2)};
      }
    `,
    infoRightColumn: css`
      flex: 1;
    `,
    walletName: css`
      display: block;
      margin-bottom: ${theme.spacing(1)};
      color: ${theme.palette.text.secondary};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(4)};
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
      margin-right: ${theme.spacing(2)};
      letter-spacing: -0.75px;
    `,
    copyButton: css`
      cursor: pointer;
      background-color: transparent;
      border: 0;
      padding: ${theme.spacing(1)};
      margin: ${theme.spacing(-1)};
      line-height: 0;

      :hover > svg {
        color: ${theme.palette.button.medium};
      }

      :active > svg {
        color: ${theme.palette.button.dark};
      }
    `,
    copyButtonIcon: css`
      color: ${theme.palette.button.main};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      transition: color 0.3s;
    `,
    bscScanLinkContainer: css`
      margin-bottom: ${theme.spacing(10)};

      ${theme.breakpoints.down('md')} {
        margin: 0 auto ${theme.spacing(8)};
      }
    `,
  };
};
