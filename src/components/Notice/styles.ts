import { css } from '@emotion/react';
import { alpha, useTheme } from '@mui/material';

import { NoticeVariant } from './types';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      border-radius: ${theme.shape.borderRadius.medium}px;
      background-color: ${theme.palette.background.default};
    `,
    inner: css`
      border-radius: ${theme.shape.borderRadius.medium}px;
      border: 1px solid ${theme.palette.secondary.light};
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
      position: absolute;
      margin-top: ${theme.spacing(0.5)};
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
    content: css`
      display: flex;
      flex-direction: column;
      padding-left: ${theme.spacing(7)};
      word-break: break-word;
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
