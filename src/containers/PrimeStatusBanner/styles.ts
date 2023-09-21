import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      justify-content: space-between;
    `,
    column: css`
      :not(:last-child) {
        margin-right: ${theme.spacing(6)};
      }
    `,
    contentColumn: css`
      max-width: ${theme.spacing(175)};
    `,
    header: css`
      display: flex;
      margin-bottom: ${theme.spacing(6)};
    `,
    primeLogo: css`
      display: block;
      width: ${theme.spacing(10)};
      margin-top: ${theme.spacing(1)};
      margin-right: ${theme.spacing(4)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    greenText: css`
      color: ${theme.palette.interactive.success};
    `,
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    stakeButton: css`
      white-space: nowrap;
    `,
    getProgress: ({ addLeftPadding }: { addLeftPadding: boolean }) => css`
      max-width: ${theme.spacing(125)};

      ${addLeftPadding &&
      css`
        padding-left: ${theme.spacing(14)};
      `}
    `,
    progressBar: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    noPrimeTokenWarning: css`
      display: flex;
      align-items: center;
      margin-top: ${theme.spacing(2)};
    `,
    warningText: css`
      color: ${theme.palette.interactive.warning};
      margin-right: ${theme.spacing(2)};
    `,
    tooltip: css`
      display: inline-flex;
    `,
    tooltipIcon: css`
      color: ${theme.palette.interactive.warning};
    `,
  };
};
