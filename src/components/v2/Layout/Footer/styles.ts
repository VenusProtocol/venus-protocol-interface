import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      height: ${theme.shape.footerHeight};
      padding: 0 ${theme.spacing(10)};
      background-color: var(--color-bg-main);
      display: flex;
      justify-content: flex-end;
      align-items: center;

      ${theme.breakpoints.down('lg')} {
        padding: 0 ${theme.spacing(6)};
      }

      ${theme.breakpoints.down('md')} {
        padding: 0 ${theme.spacing(4)};
        justify-content: space-between;
      }
    `,
    blockInfo: css`
      ${theme.breakpoints.down('md')} {
        flex: 1;
      }
    `,
    blockInfoMobileLineBreak: css`
      display: none;

      ${theme.breakpoints.down('md')} {
        display: block;
      }
    `,
    blockInfoNumber: css`
      color: ${theme.palette.text.primary};
    `,
    links: css`
      color: ${theme.palette.text.primary};
      display: flex;
      margin-left: ${theme.spacing(2)};

      ${theme.breakpoints.down('md')} {
        margin-left: 0;
      }
    `,
    link: css`
      background-color: ${theme.palette.secondary.light};
      transition: background-color 0.3s;
      margin-left: ${theme.spacing(4)};
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      border-radius: ${theme.spacing(1)};

      :hover {
        background-color: ${theme.palette.button.main};
      }

      :active {
        background-color: ${theme.palette.button.dark};
      }
    `,
    theme,
  };
};
