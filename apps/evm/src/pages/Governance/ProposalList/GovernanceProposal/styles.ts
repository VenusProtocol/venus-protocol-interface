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
      background-color: ${theme.palette.interactive.warning};
    `,
    iconMarkWrapper: css`
      background-color: ${theme.palette.interactive.success};
    `,
    iconCloseWrapper: css`
      background-color: ${theme.palette.interactive.error};
    `,
    icon: css`
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      color: white;
      ${theme.breakpoints.down('sm')} {
        width: ${theme.spacing(4)};
        height: ${theme.spacing(4)};
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
    greenPulseContainer: css`
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      padding-right: ${theme.spacing(2.5)};
      > div {
        display: flex;
      }
    `,
    greenPulse: css`
      display: inline-flex;
      height: ${theme.spacing(2.5)};
      width: ${theme.spacing(2.5)};
    `,
  };
};
