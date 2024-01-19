import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      align-items: center;
      min-height: 100%;
      flex: 1;
      flex-direction: column;
    `,
    tabs: css`
      max-width: ${theme.spacing(136)};
      width: 100%;
      padding: ${theme.spacing(10)};

      ${theme.breakpoints.down('md')} {
        max-width: 100%;
        padding: ${theme.spacing(4)};
      }
    `,
    title: css`
      margin-bottom: ${theme.spacing(12)};
      text-align: center;
      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(8)} 0;
      }
    `,
    input: css`
      margin: ${theme.spacing(1)} 0;
    `,
    inputLabel: css`
      color: ${theme.palette.text.primary};
      text-align: left;
    `,
    fontWeight600: css`
      font-weight: 600;
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
    inputSection: css`
      margin-bottom: ${theme.spacing(8)};
      width: 100%;
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(6)};
      }
    `,
    submitButton: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    remainingTime: css`
      width: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    `,
    remainingTimeSvg: css`
      margin-right: ${theme.spacing(2)};
    `,
    form: css`
      width: 100%;
    `,
    smallSpacer: css`
      margin-top: 40px;
    `,
    successMessage: css`
      color: ${theme.palette.text.secondary};
    `,
    successModalConversionAmounts: css`
      width: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    `,
    successModalToken: css`
      margin-right: ${theme.spacing(2.5)};
      span {
        font-weight: 600;
      }
    `,
    successModalArrow: css`
      margin: 0 ${theme.spacing(3.5)};
    `,
    notice: css`
      width: 100%;
    `,
  };
};
