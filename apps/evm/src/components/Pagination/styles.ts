import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin: ${theme.spacing(5)} 0;
      ${theme.breakpoints.down('sm')} {
        flex-wrap: wrap;
        justify-content: center;
      }
    `,
    itemsCountString: css`
      margin-right: ${theme.spacing(2)};
      white-space: nowrap;
      ${theme.breakpoints.down('sm')} {
        width: 100%;
        margin-right: 0;
        margin-bottom: ${theme.spacing(2)};
        text-align: center;
      }
    `,
    button: css`
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      padding: 0;
      background-color: ${theme.palette.background.paper};
      color: ${theme.palette.text.secondary};
      margin-left: ${theme.spacing(1)};
      margin-right: ${theme.spacing(1)};
      transition: color 0.3s;
      border-radius: ${theme.shape.borderRadius.verySmall}px;

      &:hover {
        color: ${theme.palette.text.primary}!important;
      }
    `,
    input: css`
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      padding: 0;
      text-align: center;
      background-color: transparent;
      color: ${theme.palette.text.primary};
      margin-left: ${theme.spacing(1)};
      margin-right: ${theme.spacing(1)};
      border: 1px solid ${theme.palette.background.paper};
      border-radius: ${theme.shape.borderRadius.verySmall}px;
      cursor: pointer;
      transition: border-color 0.3s;

      &:hover,
      &:focus {
        outline: none;
        border-color: rgb(var(--color-blue-rgb));
      }

      &::selection {
        background-color: rgb(var(--color-blue-rgb));
      }
    `,
    iconArrow: css`
      width: ${theme.shape.iconSize.xLarge}px;
      height: ${theme.shape.iconSize.xLarge}px;
      color: inherit;
    `,
    iconReverted: css`
      transform: rotate(180deg);
    `,
  };
};
