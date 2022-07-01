import { css } from '@emotion/react';
import { alpha, useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: ({
      backgroundColor,
      textColor,
    }: {
      backgroundColor: string | undefined;
      textColor: string | undefined;
    }) => css`
      display: inline-block;
      padding: ${theme.spacing(1, 3)};
      background-color: ${backgroundColor || theme.palette.secondary.light};
      border-radius: ${theme.shape.borderRadius.small}px;
      margin-right: ${theme.spacing(2)};
      > span {
        ${textColor && `color: ${textColor};`}
      }
    `,
    active: {
      backgroundColor: alpha(theme.palette.interactive.success as string, 0.1),
      textColor: theme.palette.interactive.success,
    },
    inactive: {
      backgroundColor: alpha(theme.palette.text.secondary as string, 0.1),
      textColor: theme.palette.text.secondary,
    },
    blue: {
      backgroundColor: alpha(theme.palette.interactive.primary as string, 0.1),
      textColor: theme.palette.interactive.primary,
    },
    error: {
      backgroundColor: alpha(theme.palette.interactive.error as string, 0.1),
      textColor: theme.palette.interactive.error,
    },
  };
};
