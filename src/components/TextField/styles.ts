import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
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
      let borderColor: undefined | string = theme.palette.secondary.light;

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
        border: 1px solid ${borderColor};
        background-color: ${disabled
          ? theme.palette.background.paper
          : theme.palette.background.default};
        transition: border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

        &:hover {
          border-color: ${theme.palette.text.secondary};
        }

        &:focus-within {
          border-color: ${hasError
            ? theme.palette.interactive.error
            : theme.palette.interactive.primary};
        }
      `;
    },
    getLeftIcon: ({ isSmall }: { isSmall: boolean }) => css`
      margin-right: ${theme.spacing(2)};
      width: ${theme.spacing(isSmall ? 5 : 6)};
      height: ${theme.spacing(isSmall ? 5 : 6)};
    `,
    getInput: ({
      hasRightAdornment,
      isSmall,
    }: {
      hasRightAdornment: boolean;
      isSmall: boolean;
    }) => css`
      background-color: transparent;
      flex: 1;
      font-weight: 600;
      line-height: ${theme.spacing(6)};
      padding-top: 2px; /* Vertically align input content */
      border: 0;
      width: 100%;
      height: ${theme.spacing(isSmall ? 7 : 10)};

      ${isSmall &&
      css`
        font-size: ${theme.typography.small2.fontSize};
      `}

      ${hasRightAdornment &&
      css`
        margin-right: ${theme.spacing(1)};
      `};

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
