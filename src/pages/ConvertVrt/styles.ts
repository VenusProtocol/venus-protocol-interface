import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    // Subtracting the Wormhole UST banner to show more content
    marginTop: css`
      margin-top: ${theme.spacing(20)};
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
    `,
    title: css`
      margin: ${theme.spacing(12)} 0;
      text-align: center;
    `,
    input: css`
      margin: ${theme.spacing(1)} 0;
    `,
    inputLabel: css`
      color: ${theme.palette.text.primary};
      text-align: left;
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
    inputSection: css`
      margin-bottom: ${theme.spacing(8)};
      width: 100%;
    `,
    progressBar: css`
      width: 100%;
      margin-bottom: ${theme.spacing(12)};
    `,
    submitButton: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    remainingTime: css`
      display: inline-flex;
      align-items: center;
      svg {
        margin-right: ${theme.spacing(2)};
      }
    `,
  };
};
