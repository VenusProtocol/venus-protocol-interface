import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    backButton: css`
      display: flex;
      align-items: center;
    `,
    backButtonChevronIcon: css`
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      color: ${theme.palette.text.primary};
      margin-right: ${theme.spacing(2)};
    `,
    backButtonTokenIcon: css`
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      margin-right: ${theme.spacing(2)};
    `,
    backButtonTokenSymbol: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
