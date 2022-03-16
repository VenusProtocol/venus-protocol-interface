import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return css`
    background-color: ${theme.palette.background.default};
    width: ${theme.shape.layoutOffset.width};
    margin-left: ${theme.shape.layoutOffset.ml};
    background-image: none;
    box-shadow: none;
  `;
};
