import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    container: css`
      ${theme.breakpoints.down('xxl')} {
        padding: 0;
        background-color: transparent;
      }
    `,
    title: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    cellContainer: css`
      display: flex;
      flex-wrap: wrap;

      ${theme.breakpoints.down('xxl')} {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: ${theme.spacing(2)};
      }

      ${theme.breakpoints.down('md')} {
        grid-template-columns: 1fr;
      }
    `,
    cell: css`
      flex-direction: column;
      padding: 0 ${theme.spacing(10)};

      :first-of-type {
        padding-left: 0;
      }

      :last-of-type {
        padding-right: 0;
      }

      :not(:last-of-type) {
        border-right: 1px solid ${theme.palette.interactive.delimiter};
      }

      ${theme.breakpoints.down('xxl')} {
        border-radius: ${theme.spacing(4)};
        padding: ${theme.spacing(4)};
        background-color: ${theme.palette.background.paper};

        :first-of-type {
          padding-left: ${theme.spacing(4)};
        }

        :last-of-type {
          padding-right: ${theme.spacing(4)};
        }

        :not(:last-of-type) {
          border-right: 0;
        }
      }
    `,
    labelContainer: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(1)};
    `,
    label: css`
      color: ${theme.palette.text.secondary};

      ${theme.breakpoints.down('xxl')} {
        font-size: ${theme.typography.small1.fontSize};
      }
    `,
    labelInfoIcon: css`
      margin-left: ${theme.spacing(2)};
    `,
    getValue: ({ color }: { color?: string }) => css`
      color: ${color || theme.palette.text.primary};
    `,
  };
};
