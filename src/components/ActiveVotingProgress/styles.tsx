import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    votesWrapper: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
    bar: css`
      :nth-of-type(2) {
        margin: ${theme.spacing(6)} 0;
      }
    `,
  };
};
