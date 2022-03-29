import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    getLabel: ({ hasError }: { hasError: boolean }) => css`
      display: block;
      margin-bottom: 4px;

      ${hasError && `color: ${theme.palette.error.main};`};
    `,
    getInputContainer: ({ hasError }: { hasError: boolean }) => css`
      display: flex;
      align-items: center;
      padding: ${theme.spacing(1, 1, 1, 2)};
      border-radius: 12px;
      border: 2px solid transparent;
      background-color: ${theme.palette.background.default};

      &:focus-within {
        border-color: ${hasError
          ? theme.palette.interactive.error
          : theme.palette.interactive.primary};
      }
    `,

    leftIcon: css`
      margin-right: ${theme.spacing(1)};
    `,
    getInput: ({ hasRightAdornment }: { hasRightAdornment: boolean }) => css`
      background-color: transparent;
      flex: 1;
      font-weight: 600;
      line-height: ${theme.spacing(3)};
      height: ${theme.spacing(5)};
      padding-top: 4px; /* Vertically align input content */
      border: 0;

      ${hasRightAdornment && `margin-right: ${theme.spacing(1)}`};

      &:focus {
        outline: 0;
      }
    `,
    rightButton: css`
      margin-right: ${theme.spacing(1)};
    `,
    description: css`
      display: block;
      color: ${theme.palette.text.secondary};
      margin-top: 4px;
    `,
  };
};
