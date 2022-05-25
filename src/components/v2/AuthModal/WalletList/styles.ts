import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      margin: ${theme.spacing(-2, 0)};
    `,
    getListItem: ({ isActionable }: { isActionable: boolean }) => css`
      width: 100%;
      background-color: transparent;
      box-shadow: none;
      border: 0;
      padding: ${theme.spacing(4, 10)};
      display: flex;
      align-items: center;
      color: ${theme.palette.text.primary};

      ${isActionable &&
      css`
        cursor: pointer;

        :hover {
          background-color: ${theme.palette.secondary.light};
        }
      `}
    `,
    walletLogo: css`
      width: 48px;
      margin-right: ${theme.spacing(4)};
      flex-shrink: 0;
    `,
    walletName: css`
      flex: 1;
      text-align: left;
      margin-right: ${theme.spacing(4)};
    `,
    chevronRightIcon: css`
      width: 24px;
      height: 24px;
      color: ${theme.palette.text.primary};
    `,
    comingSoonText: css`
      color: ${theme.palette.text.secondary};
      text-align: right;
    `,
    divider: css`
      width: calc(100% - ${theme.spacing(20)});
      height: 1px;
      margin: ${theme.spacing(4, 'auto')};
      background-color: ${theme.palette.secondary.light};
    `,
    footer: css`
      text-align: center;
      padding: ${theme.spacing(4, 4, 0)};
    `,
    footerLink: css`
      color: ${theme.palette.button.main};

      :hover {
        color: ${theme.palette.button.medium};
      }

      :active {
        color: ${theme.palette.button.dark};
      }
    `,
  };
};
