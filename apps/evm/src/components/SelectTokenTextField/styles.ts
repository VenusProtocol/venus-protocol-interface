import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    description: css`
      display: block;
      color: ${theme.palette.text.secondary};
      margin-top: ${theme.spacing(1)};
    `,
    getButton: ({ isTokenListShown }: { isTokenListShown: boolean }) => css`
      > span {
        display: flex;
        align-items: center;
      }

      ${
        isTokenListShown &&
        css`
        z-index: 2;

        :hover:not(:disabled),
        :not(:disabled) {
          border-color: ${theme.palette.interactive.primary};
        }
      `
      }
    `,
    getArrowIcon: ({ isTokenListShown }: { isTokenListShown: boolean }) => css`
      transform: rotate(${isTokenListShown ? '0' : '180deg'});
      color: inherit;
      margin-left: ${theme.spacing(2)};
      transition: color 0.3s;

      ${
        isTokenListShown &&
        css`
        color: ${theme.palette.interactive.primary};
      `
      }
    `,

    maxButton: css`
      margin-left: ${theme.spacing(2)};
      white-space: nowrap;
    `,
  };
};
