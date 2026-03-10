import { css } from '@emotion/react';
import { useTheme } from '@mui/material';
import { theme } from '@venusprotocol/ui';

export const useModalStyles = ({
  hasTitleComponent,
  noHorizontalPadding,
}: {
  hasTitleComponent: boolean;
  noHorizontalPadding?: boolean;
}) => {
  const muiTheme = useTheme();

  return {
    titleWrapper: css`
      padding: ${muiTheme.spacing(6, 6, hasTitleComponent ? 6 : 0, 6)};
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: ${hasTitleComponent ? theme.colors['dark-blue'] : 'transparent'};
      margin-bottom: ${hasTitleComponent ? muiTheme.spacing(6) : 0};
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-left-radius: ${muiTheme.spacing(4)};
      border-top-right-radius: ${muiTheme.spacing(4)};
      ${muiTheme.breakpoints.down('md')} {
        margin-bottom: ${hasTitleComponent ? muiTheme.spacing(4) : 0};
      }
    `,
    backAction: css`
      position: absolute;
      left: ${muiTheme.spacing(6)};
      padding: 0;
      min-width: auto;
      background-color: transparent;

      :hover {
        background-color: transparent;
      }
    `,
    backArrow: css`
      transform: rotate(180deg);
      height: ${muiTheme.shape.iconSize.xLarge}px;
      width: ${muiTheme.shape.iconSize.xLarge}px;
      color: ${muiTheme.palette.text.primary};
    `,
    titleComponent: css`
      align-self: center;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: ${muiTheme.shape.iconSize.xLarge}px;
      padding-left: ${muiTheme.shape.iconSize.xLarge}px;
      padding-right: ${muiTheme.shape.iconSize.xLarge}px;
      font-size: ${muiTheme.typography.h4.fontSize};
      font-weight: ${muiTheme.typography.h4.fontWeight};
    `,
    closeIcon: css`
      top: 50%;
      margin-top: ${-muiTheme.shape.iconSize.xLarge / 2}px;
      position: absolute;
      height: ${muiTheme.shape.iconSize.xLarge}px;
      width: ${muiTheme.shape.iconSize.xLarge}px;
      margin-left: auto;
      min-width: 0;
      padding: 0;
      background-color: transparent;

      :hover {
        background-color: transparent;
      }
    `,
    contentWrapper: css`
      padding-bottom: ${muiTheme.spacing(6)};
      padding-left: ${noHorizontalPadding ? 0 : muiTheme.spacing(6)};
      padding-right: ${noHorizontalPadding ? 0 : muiTheme.spacing(6)};
      ${muiTheme.breakpoints.down('md')} {
        padding-bottom: ${muiTheme.spacing(4)};
        padding-left: ${noHorizontalPadding ? 0 : muiTheme.spacing(4)};
        padding-right: ${noHorizontalPadding ? 0 : muiTheme.spacing(4)};
      }
    `,
  };
};
