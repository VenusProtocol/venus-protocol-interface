import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    tokenTextFieldContainer: css`
      position: relative;
      margin-bottom: ${theme.spacing(1)};
    `,
    getBackdrop: ({ isTokenListShown }: { isTokenListShown: boolean }) => css`
      ${!isTokenListShown &&
      css`
        display: none;
      `}

      position: fixed;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    `,
    getButton: ({ isTokenListShown }: { isTokenListShown: boolean }) => css`
      z-index: 2;

      :not(:disabled) {
        background-color: ${theme.palette.secondary.light};
        border-color: ${theme.palette.secondary.light};
      }

      :hover:not(:disabled),
      :active:not(:disabled) {
        background-color: ${theme.palette.secondary.light};
        border-color: ${theme.palette.text.secondary};
      }

      ${isTokenListShown &&
      css`
        :hover:not(:disabled),
        :not(:disabled) {
          border-color: ${theme.palette.interactive.primary};
        }
      `}

      > span {
        display: flex;
        align-items: center;
      }
    `,
    token: css`
      > span {
        font-size: ${theme.typography.small1.fontSize};
        font-weight: ${theme.typography.small1.fontWeight};
      }
    `,
    getArrowIcon: ({ isTokenListShown }: { isTokenListShown: boolean }) => css`
      right: ${theme.spacing(4)};
      width: ${theme.spacing(2)};
      transform: rotate(${isTokenListShown ? '0' : '180deg'});
      color: inherit;
      margin-left: ${theme.spacing(2)};
      transition: color 0.3s;

      ${isTokenListShown &&
      css`
        color: ${theme.palette.interactive.primary};
      `}
    `,
    greyLabel: css`
      color: ${theme.palette.text.secondary};
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
