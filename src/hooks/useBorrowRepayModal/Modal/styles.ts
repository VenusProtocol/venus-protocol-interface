import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-top: ${theme.spacing(10)};

      ${theme.breakpoints.down('md')} {
        margin-top: ${theme.spacing(8)};
      }
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
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
