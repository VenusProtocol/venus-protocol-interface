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
      padding: ${theme.spacing(1, 2)};

      &:not(:last-child) {
        margin-right: ${theme.spacing(4)};
      }
    `,
    swapInfoContainer: css`
      margin-top: ${theme.spacing(6)};
    `,
    notice: css`
      margin-top: ${theme.spacing(3)};
      padding: ${theme.spacing(4)};
    `,
  };
};
