import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    // Subtracting the Wormhole UST banner to show more content
    marginTop: css`
      margin-top: ${theme.spacing(20)};
      ${theme.breakpoints.down('md')} {
        margin-top: ${theme.spacing(0)};
      }
    `,
    root: css`
      display: flex;
      align-items: center;
      min-height: 100%;
      flex: 1;
      flex-direction: column;
    `,
    tabs: css`
      width: ${theme.spacing(136)};
      padding: ${theme.spacing(10)};
      ${theme.breakpoints.down('md')} {
        width: 100%;
        padding: ${theme.spacing(4)};
      }
    `,
    title: css`
      margin: ${theme.spacing(12)} 0;
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
    progressBar: css`
      width: 100%;
      margin-bottom: ${theme.spacing(12)};
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(8)};
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
  };
};
