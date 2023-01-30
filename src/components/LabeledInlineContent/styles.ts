import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
    column: css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('sm')} {
        &:first-of-type {
          margin-bottom: ${theme.spacing(1)};
        }
      }
    `,
    icon: css`
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
      margin-top: -2px;
      margin-right: ${theme.spacing(2)};
    `,
    tooltip: css`
      align-items: center;
      display: inline-flex;
      margin-left: ${theme.spacing(2)};
    `,
    infoIcon: css`
      cursor: help;
    `,
    getLabel: ({ invertTextColors }: { invertTextColors: boolean }) => css`
      color: ${invertTextColors ? theme.palette.text.primary : theme.palette.text.secondary};
    `,
    getContent: ({
      invertTextColors,
      hasIcon,
    }: {
      invertTextColors: boolean;
      hasIcon: boolean;
    }) => css`
      color: ${invertTextColors ? theme.palette.text.secondary : theme.palette.text.primary};

      ${hasIcon &&
      css`
        margin-left: ${theme.spacing(7)};
      `}
    `,
  };
};
