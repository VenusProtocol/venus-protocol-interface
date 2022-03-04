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
    padding: ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(2)};
    border-radius: 12px;
    border: 2px solid transparent;

    &:focus-within {
      border-color: ${hasError ? theme.palette.error.main : theme.palette.text.secondary};
    }
  `;

  const input = css`
    background-color: transparent;
    flex: 1;
    font-weight: 600;
    line-height: ${theme.spacing(3)};
    height: ${theme.spacing(5)};
    border: 0;

    &:focus {
      outline: 0;
    }
  `;

  const description = css`
    display: block;
    color: ${theme.palette.text.secondary};
    margin-top: 4px;
  `;

  return { getLabel, getInputContainer, input, description };
};
