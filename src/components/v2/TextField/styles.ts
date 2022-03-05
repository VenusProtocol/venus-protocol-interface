import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  const getLabel = ({ hasError }: { hasError: boolean }) => css`
    display: block;
    margin-bottom: 4px;

    ${hasError && `color: ${theme.palette.error.main};`};
  `;

  const getInputContainer = ({ hasError }: { hasError: boolean }) => css`
    display: flex;
    align-items: center;
    padding: ${theme.spacing(1, 1, 1, 2)};
    border-radius: 12px;
    border: 2px solid transparent;
    background-color: ${theme.palette.background.black};

    &:focus-within {
      border-color: ${hasError ? theme.palette.error.main : theme.palette.text.secondary};
    }
  `;

  const leftIcon = css`
    margin-right: ${theme.spacing(1)};
  `;

  const getInput = ({ hasRightAdornment }: { hasRightAdornment: boolean }) => css`
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
  `;

  const rightButton = css`
    margin-right: ${theme.spacing(1)};
  `;

  const description = css`
    display: block;
    color: ${theme.palette.text.secondary};
    margin-top: 4px;
  `;

  return { getLabel, getInputContainer, leftIcon, getInput, rightButton, description, theme };
};
