import { useTheme } from '@mui/material';
import { css } from '@emotion/react';

export const useStyles = () => {
  const theme = useTheme();
  return css`
    .MuiTooltip-popper {
      .MuiTooltip-tooltip {
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: ${theme.spacing(3)};
        background-color: ${theme.palette.secondary.light};
        font-size: ${theme.typography.small2.fontSize};
        font-weight: ${theme.typography.small2.fontWeight};
        padding: ${theme.spacing(3)};
      }
      .MuiTooltip-arrow {
        color: ${theme.palette.secondary.light};
      }
    }
  `;
};
