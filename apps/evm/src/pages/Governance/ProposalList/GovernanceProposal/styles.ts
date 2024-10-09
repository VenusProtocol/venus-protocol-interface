import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    timestamp: css`
      display: flex;
      justify-content: space-between;
    `,
    greenPulseContainer: css`
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      padding-right: ${theme.spacing(2.5)};
      > div {
        display: flex;
      }
    `,
    greenPulse: css`
      display: inline-flex;
      height: ${theme.spacing(2.5)};
      width: ${theme.spacing(2.5)};
    `,
  };
};
