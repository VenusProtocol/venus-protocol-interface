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

      ${isActionable &&
      css`
        cursor: pointer;

        :hover {
          background-color: ${theme.palette.secondary.light};
        }
      `}
    `,
    walletLogo: css`
      margin-right: ${theme.spacing(2)};
    `,
    walletName: css`
      flex: 1;
      text-align: left;
      color: ${theme.palette.text.primary};
      font-weight: 400;
      margin-right: ${theme.spacing(2)};
    `,
    comingSoonText: css`
      font-weight: 400;
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
