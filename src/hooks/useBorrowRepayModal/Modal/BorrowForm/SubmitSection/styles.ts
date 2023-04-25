import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    getSubmitButton: ({ isHighRiskBorrow }: { isHighRiskBorrow: boolean }) => css`
      ${isHighRiskBorrow &&
      css`
        background-color: ${theme.palette.error.main};
        border-color: ${theme.palette.error.main};
      `}
    `,
  };
};
