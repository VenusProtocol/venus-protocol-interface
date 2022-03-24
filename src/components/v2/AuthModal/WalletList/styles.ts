import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    getListItem: ({ isActionable }: { isActionable: boolean }) => css`
      width: 100%;
      background-color: transparent;
      box-shadow: none;
      border: 0;
      padding: ${theme.spacing(2, 5)};
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
      margin-right: ${theme.spacing(2)};
      flex-shrink: 0;
    `,
    walletName: css`
      flex: 1;
      text-align: left;
      margin-right: ${theme.spacing(2)};
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
      width: calc(100% - ${theme.spacing(10)});
      height: 1px;
      margin: ${theme.spacing(2, 'auto')};
      background-color: ${theme.palette.secondary.light};
    `,
    footer: css`
      text-align: center;
      padding: ${theme.spacing(2, 2, 0)};
    `,
    footerLink: css`
      color: ${theme.palette.button.main};

      :hover {
        color: ${theme.palette.button.dark};
      }

      :active {
        color: ${theme.palette.button.light};
      }
    `,
  };
};
