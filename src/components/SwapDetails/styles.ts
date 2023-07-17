import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    row: css`
      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(3)};
      }
    `,
    getPriceImpactText: ({ isHigh }: { isHigh: boolean }) => css`
      ${isHigh &&
      css`
        color: ${theme.palette.interactive.error};
      `}
    `,
  };
};
