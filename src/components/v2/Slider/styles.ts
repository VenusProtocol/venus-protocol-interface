import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({ over }: { over: boolean }) => {
  const theme = useTheme();
  return css`
    color: ${over ? theme.palette.interactive.error50 : theme.palette.interactive.success};
    background-color: ${theme.palette.background.default};
    height: 8px;
    padding: 0;
    .MuiSlider-track {
      height: 8px;
    }
    .MuiSlider-rail {
      height: 8px;
      color: ${theme.palette.background.default};
    }
    .MuiSlider-mark {
      width: 4px;
      height: 8px;
      color: ${theme.palette.interactive.error};
    }
  `;
};

export default useStyles;
