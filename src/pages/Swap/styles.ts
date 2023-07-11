import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      max-width: ${theme.spacing(136)};
      width: 100%;
      padding: ${theme.spacing(10)};
      margin: ${theme.spacing(0, 'auto')};

      ${theme.breakpoints.down('md')} {
        max-width: 100%;
        padding: ${theme.spacing(4)};
      }
    `,
    selectTokenTextField: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    notice: css`
      margin-top: ${theme.spacing(3)};
      padding: ${theme.spacing(4)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 6 : 3)};
    `,
    switchButton: css`
      margin: ${theme.spacing(0, 'auto', 4)};
      padding: ${theme.spacing(1)};
    `,
    switchButtonIcon: css`
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      transform: rotate(90deg);
      color: ${theme.palette.interactive.primary};
    `,
  };
};
