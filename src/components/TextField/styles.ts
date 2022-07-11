import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    theme,
    getLabel: ({ hasError }: { hasError: boolean }) => css`
      display: block;
      margin-bottom: ${theme.spacing(1)};

      color: ${hasError ? theme.palette.error.main : theme.palette.text.primary};
    `,
    getInputContainer: ({
      hasError,
      disabled,
    }: {
      hasError: boolean;
      disabled: boolean | undefined;
    }) => {
      let borderColor: undefined | string = 'transparent';

      if (hasError) {
        borderColor = theme.palette.interactive.error;
      }

      if (disabled) {
        borderColor = theme.palette.secondary.light;
      }
      return css`
        display: flex;
        align-items: center;
        padding: ${theme.spacing(2, 2, 2, 4)};
        border-radius: ${theme.spacing(3)};
        border: ${theme.spacing(0.5)} solid ${borderColor};
        background-color: ${disabled
          ? theme.palette.background.paper
          : theme.palette.background.default};
        &:focus-within {
          border-color: ${hasError
            ? theme.palette.interactive.error
            : theme.palette.interactive.primary};
        }
      `;
    },
    leftIcon: css`
      margin-right: ${theme.spacing(2)};
    `,
    getInput: ({ hasRightAdornment }: { hasRightAdornment: boolean }) => css`
      background-color: transparent;
      flex: 1;
      font-weight: 600;
      line-height: ${theme.spacing(6)};
      height: ${theme.spacing(10)};
      padding-top: 2px; /* Vertically align input content */
      border: 0;
      width: 100%;

      ${hasRightAdornment && `margin-right: ${theme.spacing(1)}`};

      &:focus {
        outline: 0;
      }
    `,
    rightButton: css`
      margin-right: ${theme.spacing(2)};
    `,
    description: css`
      display: block;
      color: ${theme.palette.text.secondary};
      margin-top: ${theme.spacing(1)};
    `,
  };
};
