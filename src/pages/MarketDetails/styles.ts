import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
    `,
    column: css`
      :not(:first-of-type) {
        margin-left: ${theme.spacing(4)};
      }

      :not(:last-of-type) {
        margin-right: ${theme.spacing(4)};
      }
    `,
    content: css`
      flex: 2;
    `,
    sideBar: css`
      flex: 1;
    `,
  };
};
