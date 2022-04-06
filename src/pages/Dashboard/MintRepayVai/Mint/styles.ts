import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    textField: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 3 : 2)};
    `,
    infoValue: css`
      color: ${theme.palette.text.primary};
    `,
    submitButton: css`
      margin-left: auto;
      margin-right: auto;
    `,
  };
};
