import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      margin: auto;
      max-width: ${theme.spacing(140)};
      width: 100%;
      padding: ${theme.spacing(10)};

      ${theme.breakpoints.down('md')} {
        max-width: 100%;
        padding: ${theme.spacing(4)};
      }
    `,
    textField: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 6 : 4)};
    `,
    noticeWarning: css`
      margin-bottom: ${theme.spacing(8)};
    `,
  };
};
