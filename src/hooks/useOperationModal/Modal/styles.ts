import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    input: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
    greyLabel: css`
      color: ${theme.palette.text.secondary};
    `,
    notice: css`
      margin-top: ${theme.spacing(3)};
      padding: ${theme.spacing(4)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 6 : 3)};

      ${theme.breakpoints.down('md')} {
        span {
          font-size: ${theme.typography.small1.fontSize};
        }
      }
    `,
    isolatedAssetWarning: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    submitButtonHighRisk: ({ isHighRiskBorrow }: { isHighRiskBorrow: boolean }) => css`
      ${isHighRiskBorrow && `background-color: ${theme.palette.error.main};`}
      ${isHighRiskBorrow && `border-color: ${theme.palette.error.main};`}
    `,
  };
};
