import { useTheme } from '@mui/material';
import { css } from '@emotion/react';

export const useStyles = () => {
  const theme = useTheme();

  return {
    topProgressBarLegend: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${theme.spacing(3)};
    `,
    inlineContainer: css`
      display: flex;
    `,
    inlineLabel: css`
      margin-right: ${theme.spacing(1)};
    `,
    inlineValue: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
