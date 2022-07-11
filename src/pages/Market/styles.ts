import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    headerRoot: css`
      margin-bottom: ${theme.spacing(8)};
      padding: ${theme.spacing(4)} 0 ${theme.spacing(4)} ${theme.spacing(6)};

      ${theme.breakpoints.down('xxl')} {
        padding: 0;
        background-color: transparent;
        margin-bottom: ${theme.spacing(6)};
      }
    `,
    row: css`
      display: flex;
      flex-wrap: wrap;
    `,
    box: css`
      flex-direction: column;
      border-right: ${theme.spacing(0.25)} solid ${theme.palette.interactive.delimiter};
      padding-right: ${theme.spacing(10)};
      padding-left: ${theme.spacing(10)};
      padding-top: ${theme.spacing(6)};
      padding-bottom: ${theme.spacing(6)};
      border-radius: 0;

      :first-of-type {
        padding-left: 0;
      }
      :last-of-type {
        border-right: none;
        padding-right: 0;
      }

      ${theme.breakpoints.down('xxl')} {
        flex-basis: calc(50% - ${theme.spacing(2)});
        border-right: none;
        background-color: ${theme.palette.background.paper};
        border-radius: ${theme.shape.borderRadius.large}px;
        padding: ${theme.spacing(4)};

        :first-of-type {
          padding-left: ${theme.spacing(4)};
          margin-right: ${theme.spacing(1)};
          margin-bottom: ${theme.spacing(1)};
        }

        :nth-of-type(2) {
          margin-left: ${theme.spacing(1)};
          margin-bottom: ${theme.spacing(1)};
        }

        :nth-of-type(3) {
          margin-right: ${theme.spacing(1)};
          margin-top: ${theme.spacing(1)};
        }

        :last-of-type {
          margin-left: ${theme.spacing(1)};
          margin-top: ${theme.spacing(1)};
        }
      }
      ${theme.breakpoints.down('md')} {
        flex-basis: calc(100%);
        border-right: none;
        background-color: ${theme.palette.background.paper};
        border-radius: ${theme.shape.borderRadius.large}px;
        padding: ${theme.spacing(4)};

        :first-of-type {
          margin-right: initial;
          margin-bottom: ${theme.spacing(2)};
        }

        :nth-of-type(2) {
          margin-left: initial;
          margin-bottom: ${theme.spacing(2)};
        }

        :nth-of-type(3) {
          margin-right: initial;
          margin-top: initial;
          margin-bottom: ${theme.spacing(2)};
        }

        :last-of-type {
          margin-left: initial;
          margin-top: initial;
          margin-bottom: 0;
        }
      }
    `,
    title: css`
      display: block;
      margin-bottom: ${theme.spacing(1)};

      ${theme.breakpoints.down('xl')} {
        font-size: 0.75rem;
      }
    `,
    value: css`
      ${theme.breakpoints.down('xl')} {
        font-size: ${theme.typography.body2.fontSize};
        font-weight: ${theme.typography.body2.fontWeight};
        letter-spacing: ${theme.typography.body2.letterSpacing};
        color: ${theme.palette.text.primary};
      }
    `,
    table: css`
      display: block;

      ${theme.breakpoints.down('xxl')} {
        display: none;
      }
    `,
    cards: css`
      display: none;

      ${theme.breakpoints.down('xxl')} {
        display: block;
      }
    `,
  };
};
