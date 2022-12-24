import { css } from '@emotion/react';
import { alpha, useTheme } from '@mui/material';

import { ChipType } from './types';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: ({ chipType }: { chipType: ChipType }) => {
      let backgroundColor;
      let textColor;

      switch (chipType) {
        case 'active':
          backgroundColor = alpha(theme.palette.interactive.success as string, 0.1);
          textColor = theme.palette.interactive.success;
          break;
        case 'inactive':
          backgroundColor = alpha(theme.palette.text.secondary as string, 0.1);
          textColor = theme.palette.text.secondary;
          break;
        case 'blue':
          backgroundColor = alpha(theme.palette.interactive.primary as string, 0.1);
          textColor = theme.palette.interactive.primary;
          break;
        case 'error':
          backgroundColor = alpha(theme.palette.interactive.error as string, 0.1);
          textColor = theme.palette.interactive.error;
          break;
        default:
          backgroundColor = theme.palette.secondary.light;
          break;
      }

      return css`
        display: inline-flex;
        align-items: center;
        padding: ${theme.spacing(1, chipType === 'default' ? 2 : 3)};
        background-color: ${backgroundColor};
        border-radius: ${theme.shape.borderRadius.small}px;
        margin-right: ${theme.spacing(2)};

        ${textColor &&
        css`
          > span {
            color: ${textColor};
          }
        `}
      `;
    },
    icon: css`
      margin-right: ${theme.spacing(1)};
    `,
  };
};
