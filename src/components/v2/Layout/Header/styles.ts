import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    appBar: css`
      background-image: none;
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    `,
    toolbar: css`
      padding: ${theme.spacing(8, 10, 0)} !important;
      justify-content: space-between;
      display: flex;

      ${theme.breakpoints.down('lg')} {
        padding-left: ${theme.spacing(6)} !important;
        padding-right: ${theme.spacing(6)} !important;
      }

      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(6, 4, 0)} !important;
      }
    `,
    backButton: css`
      display: flex;
      align-items: center;
    `,
    backButtonChevronIcon: css`
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      color: ${theme.palette.text.primary};
      margin-right: ${theme.spacing(2)};
    `,
    backButtonTokenIcon: css`
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      margin-right: ${theme.spacing(2)};
    `,
    backButtonTokenSymbol: css`
      color: ${theme.palette.text.primary};
    `,
    claimXvsButton: css`
      margin-right: ${theme.spacing(6)};
    `,
    ctaContainer: css`
      display: flex;
      align-items: center;
      margin-left: auto;
    `,
  };
};
