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
      margin-bottom: ${theme.spacing(6)};
    `,
    row: css`
      display: flex;

      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(6)};
      }
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
    stat: css`
      :not(:last-of-type) {
        margin-right: ${theme.spacing(6)};
        padding-right: ${theme.spacing(6)};
        border-right: 1px solid ${theme.palette.secondary.light};
      }
    `,
    statLabel: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    statValue: css`
      ${theme.breakpoints.down('md')} {
        font-size: ${theme.typography.small1.fontSize};
      }
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
