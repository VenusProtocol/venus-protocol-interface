import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    textWithTooltip: css`
      display: inline-flex;
      align-items: center;
    `,
    tooltip: css`
      align-items: center;
      display: inline-flex;
      margin-left: ${theme.spacing(2)};
    `,
    infoIcon: css`
      cursor: help;
    `,
  };
};
