import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    // /* StatusCard styles */
    statusText: css`
      color: ${theme.palette.text.primary};
      text-transform: none;
      margin-top: ${theme.spacing(2)};
      text-align: center;
      ${theme.breakpoints.down('sm')} {
        margin-top: 0;
        margin-left: ${theme.spacing(3)};
      }
    `,

    iconWrapper: css`
      border-radius: 50%;
      width: ${theme.shape.iconSize.xxLarge}px;
      height: ${theme.shape.iconSize.xxLarge}px;
      display: flex;
      align-items: center;
      justify-content: center;
      ${theme.breakpoints.down('sm')} {
        width: ${theme.shape.iconSize.xLarge}px;
        height: ${theme.shape.iconSize.xLarge}px;
      }
    `,
    iconDotsWrapper: css`
      background-color: ${theme.palette.text.secondary};
    `,
    iconInfoWrapper: css`
      background-color: ${theme.palette.interactive.primary};
    `,
    iconMarkWrapper: css`
      background-color: ${theme.palette.interactive.success};
    `,
    iconCloseWrapper: css`
      background-color: ${theme.palette.interactive.error};
    `,
    icon: css`
      width: ${theme.shape.iconSize.medium}px;
      height: ${theme.shape.iconSize.medium}px;
      color: white;
      ${theme.breakpoints.down('sm')} {
        width: ${theme.shape.iconSize.small}px;
        height: ${theme.shape.iconSize.small}px;
      }
    `,
    iconCheck: css`
      background-color: ${theme.palette.interactive.success};
      border-radius: 50%;
      stroke-width: ${theme.spacing(0.5)};
    `,
    timestamp: css`
      display: flex;
      justify-content: space-between;
    `,
  };
};
