import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    liquidationWarning: css`
      border: ${theme.spacing(0.5)} solid ${theme.palette.interactive.error};
      margin-top: ${theme.spacing(3)};
      padding: ${theme.spacing(4)};
      border-radius: ${theme.spacing(3)};
      display: flex;
      align-items: center;
    `,
    liquidationWarningIcon: css`
      color: ${theme.palette.interactive.error};
      margin-right: ${theme.spacing(2)};
    `,
  };
};
