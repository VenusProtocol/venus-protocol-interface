import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  const label = css`
    display: block;
    margin-bottom: 4px;
  `;

  const inputContainer = css`
    display: flex;
    padding: ${theme.spacing(1)};
    border-radius: 12px;
    border: 2px solid transparent;

    &:focus-within {
      border-color: ${theme.palette.text.secondary};
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

  return { label, inputContainer, input };
};
