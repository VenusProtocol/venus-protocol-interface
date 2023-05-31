import { css } from '@emotion/react';
import { alpha, useTheme } from '@mui/material';

import { NoticeVariant } from './types';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      border-radius: ${theme.shape.borderRadius.medium}px;
      background-color: ${theme.palette.background.default};
      border-radius: ${theme.shape.borderRadius.medium}px;
      border: 1px solid ${theme.palette.secondary.light};
      display: flex;
      flex-direction: row;

      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(4)};
      }
    `,
    getInnerStyles: ({ variant }: { variant: NoticeVariant }) => {
      switch (variant) {
        default:
        case 'info':
          return css`
            border-color: ${theme.palette.secondary.light};
            background-color: ${alpha(theme.palette.secondary.light, 0.2)};
          `;
        case 'error':
          return css`
            border-color: ${theme.palette.interactive.error};
            background-color: ${alpha(theme.palette.interactive.error as string, 0.05)};
          `;
        case 'success':
          return css`
            border-color: ${theme.palette.interactive.success};
            background-color: ${alpha(theme.palette.interactive.success as string, 0.1)};
          `;
        case 'warning':
          return css`
            border-color: ${theme.palette.interactive.warning};
            background-color: ${alpha(theme.palette.interactive.warning as string, 0.05)};
          `;
      }
    },
    icon: css`
      margin-right: ${theme.spacing(3)};
    `,
    getIconStyles: ({ variant }: { variant: NoticeVariant }) => {
      switch (variant) {
        default:
        case 'info':
          return css`
            color: ${theme.palette.interactive.primary};
          `;
        case 'error':
          return css`
            color: ${theme.palette.interactive.error};
          `;
        case 'success':
          return css`
            color: ${theme.palette.interactive.success};
          `;
        case 'warning':
          return css`
            color: ${theme.palette.interactive.warning};
          `;
      }
    },
    iconSize: theme.shape.iconSize.large,
    content: css`
      display: flex;
      flex-direction: column;
      word-break: break-word;

      a {
        color: ${theme.palette.interactive.primary};
      }

      a:hover {
        text-decoration: underline;
      }
    `,
    title: css`
      font-weight: bold;
    `,
    getDescription: ({ hasMarginTop }: { hasMarginTop: boolean }) =>
      hasMarginTop &&
      css`
        margin-top: ${theme.spacing(2)};
      `,
  };
};
