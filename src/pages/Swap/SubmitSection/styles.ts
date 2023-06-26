import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-top: ${theme.spacing(8)};
    `,
    buttonLabelContainer: css`
      margin-bottom: ${theme.spacing(1)};
      display: flex;
      align-items: center;
    `,
    buttonLabel: css`
      display: block;
      color: ${theme.palette.text.primary};
    `,
    approveTokenButton: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    approveTokenTooltip: css`
      display: flex;
      margin-left: ${theme.spacing(2)};
    `,
  };
};
