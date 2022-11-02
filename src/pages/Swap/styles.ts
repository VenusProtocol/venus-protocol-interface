import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      max-width: ${theme.spacing(136)};
      width: 100%;
      padding: ${theme.spacing(10)};
      margin: ${theme.spacing(34, 'auto', 0)};

      ${theme.breakpoints.down('md')} {
        max-width: 100%;
        padding: ${theme.spacing(4)};
        margin-top: ${theme.spacing(0)};
      }
    `,
    selectTokenTextField: css`
      margin-bottom: ${theme.spacing(8)};
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
    swapInfoRow: css`
      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(3)};
      }
    `,
    submitButton: css`
      margin-top: ${theme.spacing(8)};
    `,
  };
};
