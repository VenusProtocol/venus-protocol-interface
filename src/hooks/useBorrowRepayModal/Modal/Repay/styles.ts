import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    selectButtonsContainer: css`
      display: flex;
      flex-direction: row;
    `,
    selectButton: css`
      flex: 1;
      border-radius: ${theme.spacing(13)};
      padding-left: ${theme.spacing(2)};
      padding-right: ${theme.spacing(2)};

      &:not(:last-child) {
        margin-right: ${theme.spacing(4)};
      }
    `,
  };
};
