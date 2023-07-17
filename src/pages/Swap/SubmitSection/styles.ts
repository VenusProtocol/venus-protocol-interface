import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-top: ${theme.spacing(10)};

      ${theme.breakpoints.down('md')} {
        margin-top: ${theme.spacing(8)};
      }
    `,
    getSubmitButton: ({ isDangerous }: { isDangerous: boolean }) => css`
      ${isDangerous &&
      css`
        background-color: ${theme.palette.error.main};
        border-color: ${theme.palette.error.main};
      `}
    `,
  };
};
