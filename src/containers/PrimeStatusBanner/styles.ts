import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    getContainer: ({ isProgressDisplayed }: { isProgressDisplayed: boolean }) => css`
      display: flex;
      justify-content: space-between;

      ${!isProgressDisplayed &&
      css`
        align-items: center;
      `}

      ${theme.breakpoints.down('md')} {
        flex-direction: column;
        padding: ${theme.spacing(4)};

        ${!isProgressDisplayed &&
        css`
          align-items: flex-start;
        `}
      }
    `,
    getContentColumn: ({ isWarningDisplayed }: { isWarningDisplayed: boolean }) => css`
      :not(:last-child) {
        margin-right: ${theme.spacing(6)};
      }

      ${theme.breakpoints.down('md')} {
        ${isWarningDisplayed
          ? css`
              order: 2;
            `
          : css`
              margin-bottom: ${theme.spacing(6)};
            `}

        :not(:last-child) {
          margin-right: 0;
        }
      }

      ${theme.breakpoints.down('sm')} {
        width: 100%;
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

      ${theme.breakpoints.down('sm')} {
        padding-left: 0;
        width: 100%;
      }
    `,
    getHeader: ({ isProgressDisplayed }: { isProgressDisplayed: boolean }) => css`
      display: flex;

      ${isProgressDisplayed
        ? css`
            margin-bottom: ${theme.spacing(6)};
          `
        : css`
            align-items: center;
          `};

      ${theme.breakpoints.down('sm')} {
        flex-direction: column;

        ${!isProgressDisplayed &&
        css`
          align-items: flex-start;
        `}
      }
    `,
    getPrimeLogo: ({ isProgressDisplayed }: { isProgressDisplayed: boolean }) => css`
      display: inline-flex;
      width: ${theme.spacing(10)};
      margin-right: ${theme.spacing(4)};

      ${!isProgressDisplayed &&
      css`
        margin-top: ${theme.spacing(1)};
      `};

      ${theme.breakpoints.down('sm')} {
        margin-top: ${theme.spacing(0)};
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    getTitle: ({ isDescriptionDisplayed }: { isDescriptionDisplayed: boolean }) => css`
      ${isDescriptionDisplayed &&
      css`
        margin-bottom: ${theme.spacing(2)};
      `};
    `,
    greenText: css`
      color: ${theme.palette.interactive.success};
    `,
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    button: css`
      white-space: nowrap;

      ${theme.breakpoints.down('sm')} {
        width: 100%;
      }
    `,
    getProgress: ({ addLeftPadding }: { addLeftPadding: boolean }) => css`
      ${addLeftPadding &&
      css`
        max-width: ${theme.spacing(125)};
        padding-left: ${theme.spacing(14)};

        ${theme.breakpoints.down('md')} {
          max-width: none;
        }

        ${theme.breakpoints.down('sm')} {
          padding-left: 0;
        }
      `}
    `,
    progressBar: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    getNoPrimeTokenWarning: ({ isProgressDisplayed }: { isProgressDisplayed: boolean }) => css`
      display: flex;
      align-items: center;
      text-align: right;

      ${isProgressDisplayed &&
      css`
        margin-top: ${theme.spacing(2)};
      `};

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
