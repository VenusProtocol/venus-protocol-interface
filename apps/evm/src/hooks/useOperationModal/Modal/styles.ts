import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    input: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
    greyLabel: css`
      color: ${theme.palette.text.secondary};
    `,
    notice: css`
      margin-top: ${theme.spacing(3)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 6 : 3)};
    `,
    assetWarning: css`
      margin-bottom: ${theme.spacing(6)};
    `,
  };
};
