import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    itemList: css`
      margin: 0;
      padding: 0;
    `,
    item: css`
      list-style: none;
      padding: ${theme.spacing(3, 0)};

      :not(:last-of-type) {
        border-bottom: 1px solid ${theme.palette.secondary.light};
      }
    `,
    value: css`
      font-weight: ${theme.typography.body2.fontWeight};
    `,
  };
};
