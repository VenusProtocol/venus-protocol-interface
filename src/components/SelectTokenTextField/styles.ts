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
    tokenListContainer: css`
      position: relative;
    `,
    getBackdrop: ({ isTokenListShown }: { isTokenListShown: boolean }) => css`
      display: none;
      position: fixed;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      ${isTokenListShown &&
      css`
        display: block;
      `}
    `,
    getButton: ({ isTokenListShown }: { isTokenListShown: boolean }) => css`
      > span {
        display: flex;
        align-items: center;
      }

      ${isTokenListShown &&
      css`
        z-index: 2;

        :hover:not(:disabled),
        :not(:disabled) {
          border-color: ${theme.palette.interactive.primary};
        }
      `}
    `,
    token: css`
      > img {
        width: ${theme.shape.iconSize.large}px;
        height: ${theme.shape.iconSize.large}px;
      }

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
      margin-left: ${theme.spacing(3)};
      transition: color 0.3s;

      ${isTokenListShown &&
      css`
        color: ${theme.palette.interactive.primary};
      `}
    `,

    maxButton: css`
      margin-left: ${theme.spacing(2)};
    `,
  };
};
