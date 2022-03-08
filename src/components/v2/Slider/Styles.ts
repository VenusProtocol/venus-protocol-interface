import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = ({ over }: { over: boolean }) => {
  const theme = useTheme();
  return css`
    color: ${over ? theme.palette.v2.interactive.error50 : theme.palette.v2.interactive.success};
    background-color: ${theme.palette.v2.background.primary};
    height: 8px;
    padding: 0;
    .MuiSlider-track {
      height: 8px;
    }
    .MuiSlider-rail {
      height: 8px;
      color: ${theme.palette.v2.background.primary};
    }
    .MuiSlider-mark {
      width: 4px;
      height: 8px;
      color: ${theme.palette.v2.interactive.error};
    }
  `;
};

export default styles;
