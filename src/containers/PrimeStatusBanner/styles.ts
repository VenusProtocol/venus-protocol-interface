import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      justify-content: space-between;

      ${theme.breakpoints.down('md')} {
        flex-direction: column;
      }
    `,
    column: css`
      :not(:last-child) {
        margin-right: ${theme.spacing(6)};
      }
    `,
    getContentColumn: ({ isWarningDisplayed }: { isWarningDisplayed: boolean }) => css`
      ${theme.breakpoints.down('md')} {
        ${isWarningDisplayed
          ? css`
              order: 2;
            `
          : css`
              margin-bottom: ${theme.spacing(6)};
            `}
      }
    `,
    getCtaColumn: ({
      isWarningDisplayed,
      isTitleDisplayed,
    }: {
      isWarningDisplayed: boolean;
      isTitleDisplayed: boolean;
    }) => css`
      ${theme.breakpoints.down('md')} {
        ${isWarningDisplayed &&
        css`
          order: 1;
        `}
        ${!isWarningDisplayed &&
        isTitleDisplayed &&
        css`
          padding-left: ${theme.spacing(14)};
        `}
      }
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
      ${addLeftPadding &&
      css`
        max-width: ${theme.spacing(125)};
        padding-left: ${theme.spacing(14)};

        ${theme.breakpoints.down('md')} {
          max-width: none;
        }
      `}
    `,
    progressBar: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    noPrimeTokenWarning: css`
      display: flex;
      align-items: center;
      margin-top: ${theme.spacing(2)};
      text-align: right;

      ${theme.breakpoints.down('md')} {
        margin-top: 0;
        margin-bottom: ${theme.spacing(4)};
      }
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
