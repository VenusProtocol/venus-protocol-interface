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
      justify-content: space-between;
      align-items: flex-start;
      text-align: right;

      :not(:last-child) {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    rewardAmountDollars: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
