import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      margin: ${theme.spacing(0, 10)};

      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(-2, 4, 0)};
      }
    `,
    walletList: css`
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-gap: ${theme.spacing(4)};
      align-items: start;

      ${theme.breakpoints.down('md')} {
        grid-template-columns: 1fr 1fr 1fr;
        row-gap: ${theme.spacing(2)};
        column-gap: ${theme.spacing(0)};
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    getListItem: ({ isActionable }: { isActionable: boolean }) => css`
      background-color: transparent;
      box-shadow: none;
      border: 0;
      border-radius: ${theme.shape.borderRadius.small}px;
      padding: ${theme.spacing(2)};
      color: ${theme.palette.text.primary};
      text-align: center;

      ${isActionable &&
      css`
        cursor: pointer;

        :hover {
          background-color: ${theme.palette.secondary.light};
        }
      `}
    `,
    walletLogo: css`
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      margin: ${theme.spacing(0, 'auto', 1)};
      display: block;

      ${theme.breakpoints.down('md')} {
        width: ${theme.spacing(10)};
      }
    `,
    comingSoonText: css`
      color: ${theme.palette.text.secondary};
    `,
  };
};
