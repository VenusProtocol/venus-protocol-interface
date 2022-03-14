import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();
  return css`
    padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
    border-radius: ${theme.shape.borderRadius};
    font-size: ${theme.typography.body1.fontSize};
    color: ${theme.palette.text.primary};
    min-width: 150px;
    text-transform: none;
    :active {
      background-color: ${theme.palette.button.light};
    }
    &.MuiButton-outlinedButton:hover {
      background-color: ${theme.palette.button.main};
    }
    &.MuiButton-outlinedButton:active {
      background-color: ${theme.palette.button.dark};
      border-color: ${theme.palette.button.dark};
    }
    &.Mui-disabled:disabled,
    &.Mui-disabled[disabled] {
      background-color: ${theme.palette.secondary.light};
      color: ${theme.palette.text.primary};
      cursor: not-allowed;
      pointer-events: auto;
    }

    &.MuiButton-text {
      color: ${theme.palette.button.main};
    }
    &.MuiButton-text:hover {
      color: ${theme.palette.button.dark};
      background-color: transparent;
    }
    &.MuiButton-text:active {
      color: ${theme.palette.button.light};
      background-color: transparent;
    }
  `;
};

export default styles;
