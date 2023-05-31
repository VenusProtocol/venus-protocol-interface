import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

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
      left: calc(50% + ${theme.shape.drawerWidthDesktop});
      transform: translate(calc(-50% - (${theme.shape.drawerWidthDesktop}) / 2), -50%);
      border: 1px ${theme.palette.secondary.light} solid;
      ${theme.breakpoints.down('lg')} {
        left: calc(50% + ${theme.shape.drawerWidthTablet});
        transform: translate(calc(-50% - (${theme.shape.drawerWidthTablet}) / 2), -50%);
      }
      ${theme.breakpoints.down('md')} {
        left: 50%;
        transform: translate(-50%, -50%);
      }
      width: calc(100% - ${theme.spacing(8)});
      max-width: ${theme.spacing(136)};
      border-radius: ${theme.spacing(6)};
      background-color: ${theme.palette.background.paper};
      overflow: auto;
      max-height: calc(100% - ${theme.spacing(8)});
    `,
    titleWrapper: css`
      padding-left: ${theme.spacing(6)};
      padding-right: ${theme.spacing(6)};
      padding-top: ${theme.spacing(6)};
      padding-bottom: ${hasTitleComponent ? theme.spacing(6) : 0};
      border-bottom: ${hasTitleComponent ? `1px solid ${theme.palette.secondary.light}` : 0};
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: ${hasTitleComponent ? theme.palette.background.paper : 'transparent'};
      margin-bottom: ${hasTitleComponent ? theme.spacing(6) : 0};
      display: flex;
      align-items: center;
      justify-content: center;
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${hasTitleComponent ? theme.spacing(4) : 0};
      }
    `,
    backAction: css`
      position: absolute;
      left: ${theme.spacing(6)};
      padding: 0;
      min-width: auto;
      background-color: transparent;

      :hover {
        background-color: transparent;
      }
    `,
    backArrow: css`
      transform: rotate(180deg);
      height: ${theme.shape.iconSize.xLarge}px;
      width: ${theme.shape.iconSize.xLarge}px;
      color: ${theme.palette.text.primary};
    `,
    titleComponent: css`
      align-self: center;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: ${theme.shape.iconSize.xLarge}px;
      padding-left: ${theme.shape.iconSize.xLarge}px;
      padding-right: ${theme.shape.iconSize.xLarge}px;
      font-size: ${theme.typography.h4.fontSize};
      font-weight: ${theme.typography.h4.fontWeight};
    `,
    closeIcon: css`
      right: ${theme.spacing(6)};
      top: 50%;
      margin-top: ${-theme.shape.iconSize.xLarge / 2}px;
      position: absolute;
      height: ${theme.shape.iconSize.xLarge}px;
      width: ${theme.shape.iconSize.xLarge}px;
      margin-left: auto;
      min-width: 0;
      padding: 0;
      background-color: transparent;

      :hover {
        background-color: transparent;
      }
    `,
    closeIconSize: theme.shape.iconSize,
    contentWrapper: css`
      padding-bottom: ${theme.spacing(10)};
      padding-left: ${noHorizontalPadding ? 0 : theme.spacing(10)};
      padding-right: ${noHorizontalPadding ? 0 : theme.spacing(10)};
      ${theme.breakpoints.down('md')} {
        padding-bottom: ${theme.spacing(4)};
        padding-left: ${noHorizontalPadding ? 0 : theme.spacing(4)};
        padding-right: ${noHorizontalPadding ? 0 : theme.spacing(4)};
      }
    `,
  };
};
