import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    textField: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: ${theme.spacing(isLast ? 3 : 2)};
    `,
    infoColumn: css`
      display: flex;
      align-items: center;
      padding-right: ${theme.spacing(2)};
    `,
    coinIcon: css`
      width: 20px;
      height: 20px;
      margin-right: ${theme.spacing(1)};
    `,
    infoValue: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
