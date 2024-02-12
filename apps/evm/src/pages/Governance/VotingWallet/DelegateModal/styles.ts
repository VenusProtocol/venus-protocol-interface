import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    inputLabels: css`
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: ${theme.spacing(8)};
    `,
    inline: css`
      padding: 0;
    `,
  };
};
