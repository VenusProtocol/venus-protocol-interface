import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    header: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    `,
    title: css`
      margin-right: ${theme.spacing(4)};
      margin-bottom: ${theme.spacing(4)};
    `,
    legendsContainer: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(4)};
    `,
    legend: css`
      display: flex;
      align-items: center;

      :not(:last-of-type) {
        margin-right: ${theme.spacing(6)};
      }
    `,
    legendLabel: css`
      color: ${theme.palette.text.primary};
    `,
    getLegendColorIndicator: ({ color }: { color: string }) => css`
      background-color: ${color};
      width: ${theme.spacing(2)};
      height: ${theme.spacing(2)};
      border-radius: ${theme.spacing(2)};
      margin-right: ${theme.spacing(1)};
    `,
  };
};
