import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

const iconCloseSize = '35px';

export const useModalStyles = ({
  hasTitleComponent,
  noHorizontalPadding,
}: {
  hasTitleComponent: boolean;
  noHorizontalPadding?: boolean;
}) => {
  const theme = useTheme();

  return {
    box: css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% - ${theme.spacing(4)});
      max-width: 544px;
      border-radius: ${theme.spacing(3)};
      background-color: ${theme.palette.background.paper};
      overflow: auto;
      max-height: calc(100% - ${theme.spacing(4)});
    `,
    titleWrapper: css`
      padding-left: ${theme.spacing(3)};
      padding-right: ${theme.spacing(3)};
      padding-top: ${theme.spacing(3)};
      padding-bottom: ${hasTitleComponent ? theme.spacing(3) : 0};
      border-bottom: ${hasTitleComponent ? `1px solid ${theme.palette.secondary.light}` : 0};
      margin-bottom: ${hasTitleComponent ? theme.spacing(3) : 0};
      position: sticky;
      top: 0;
      background-color: ${hasTitleComponent ? theme.palette.background.paper : 'transparent'};
    `,
    titleComponent: css`
      align-self: center;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: ${iconCloseSize};
      padding-left: ${iconCloseSize};
      padding-right: ${iconCloseSize};
    `,
    closeIcon: css`
      right: ${theme.spacing(3)};
      top: ${theme.spacing(3)};
      position: absolute;
      height: ${iconCloseSize};
      width: ${iconCloseSize};
      min-width: ${iconCloseSize};
      margin-left: auto;
      padding: 0;
      background-color: ${theme.palette.background.paper};
    `,
    contentWrapper: css`
      padding-bottom: ${theme.spacing(3)};
      padding-left: ${noHorizontalPadding ? 0 : theme.spacing(3)};
      padding-right: ${noHorizontalPadding ? 0 : theme.spacing(3)};
    `,
  };
};
