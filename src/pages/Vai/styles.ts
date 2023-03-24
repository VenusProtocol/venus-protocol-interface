import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      display: flex;
      align-items: center;
      min-height: 100%;
      flex: 1;
      flex-direction: column;
    `,
    tabs: css`
      max-width: ${theme.spacing(140)};
      width: 100%;
      padding: ${theme.spacing(10)};

      ${theme.breakpoints.down('md')} {
        max-width: 100%;
        padding: ${theme.spacing(4)};
      }
    `,
    tabContentContainer: css`
      flex: 1;
      display: flex;
      flex-direction: column;
    `,
    ctaContainer: css`
      flex: 1;
    `,
    textField: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 6 : 4)};
    `,
  };
};
