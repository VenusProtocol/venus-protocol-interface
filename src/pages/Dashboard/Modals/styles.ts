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
    input: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    greyLabel: css`
      color: ${theme.palette.text.secondary};
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
    totalAndLimit: css`
      display: flex;
      justify-content: space-between;
    `,
    infoRow: css`
      margin: ${theme.spacing(3)} 0;
      ${theme.breakpoints.down('md')} {
        span {
          font-size: 0.875rem;
        }
      }
    `,
    borrowLimit: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    dailyEarnings: css`
      margin-top: ${theme.spacing(6)};
    `,
    progressSection: css`
      margin: ${theme.spacing(7.5)} 0;
      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(6)} 0;
      }
    `,
    bottomInfo: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    centerColumn: css`
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: ${theme.spacing(13)};
    `,
    icon: css`
      height: ${theme.spacing(12)};
      width: ${theme.spacing(12)};
      margin-bottom: ${theme.spacing(8)};
    `,
    successTitle: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    successMessage: css`
      margin-bottom: ${theme.spacing(10)};
      display: inline-flex;
      align-items: center;
      svg {
        margin-left: ${theme.spacing(2)};
      }
    `,
    bscScan: css`
      margin-bottom: ${theme.spacing(10)};
    `,
  };
};
