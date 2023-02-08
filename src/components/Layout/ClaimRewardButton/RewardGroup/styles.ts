import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-bottom: ${theme.spacing(4)};

      :not(:last-child) {
        padding-bottom: ${theme.spacing(4)};
        border-bottom: 1px solid ${theme.palette.secondary.light};
      }
    `,
    header: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${theme.spacing(4)};
    `,
    groupItem: css`
      display: flex;
      align-items: center;

      :not(:last-child) {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    rewardTokenIcon: css`
      margin-right: ${theme.spacing(2)};
    `,
    rewardAmount: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
