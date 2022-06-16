import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      padding-top: 0;
      padding-bottom: 0;
      ${theme.breakpoints.down('sm')} {
        padding-left: 0;
        padding-right: 0;
      }
    `,
    gridItem: css`
      padding: ${theme.spacing(6, 0)};
      ${theme.breakpoints.down('sm')} {
        padding-left: ${theme.spacing(6)};
        padding-right: ${theme.spacing(6)};
      }
    `,
    gridItemLeft: css`
      padding-right: ${theme.spacing(6)};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    `,
    cardHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    cardTitle: css`
      margin-top: ${theme.spacing(5)};
      margin-bottom: ${theme.spacing(6)};
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    `,
    countdown: css`
      display: flex;
      justify-content: space-between;
    `,
    gridItemRight: css`
      padding-left: ${theme.spacing(6)};
      border-left: 1px solid ${theme.palette.secondary.light};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      ${theme.breakpoints.down('sm')} {
        flex-direction: row;
        border-left: none;
        border-top: 1px solid ${theme.palette.secondary.light};
        padding-top: ${theme.spacing(10)};
        padding-bottom: ${theme.spacing(10)};
      }
    `,

    /* StatusCard styles */
    votesWrapper: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
    voteRow: css`
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: ${theme.spacing(1)};
      margin-top: ${theme.spacing(6)};
      & > * {
        font-size: ${theme.spacing(3)};
      }
      &:first-of-type {
        margin-top: 0;
      }
    `,
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
  };
};
