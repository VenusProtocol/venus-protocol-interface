import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      border-radius: ${theme.shape.borderRadius.small}px;
      background-color: ${theme.palette.background.default};
      padding: ${theme.spacing(3)};
    `,
    item: css`
      display: flex;
      align-items: center;
      margin-right: auto;

      &:not(:last-of-type) {
        margin-bottom: ${theme.spacing(2)};
      }
    `,
    itemLabel: css`
      color: ${theme.palette.text.secondary};
      margin-right: ${theme.spacing(2)};
    `,
    itemValue: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
