import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    header: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    headerBottomRow: css`
      display: flex;
      align-items: center;
      justify-content: space-between;

      ${theme.breakpoints.down('md')} {
        display: block;
      }
    `,
    rightColumn: css`
      display: flex;
      align-items: center;
    `,
    toggleContainer: css`
      display: flex;
      align-items: center;
    `,
    toggleLabel: css`
      margin-left: ${theme.spacing(2)};
    `,
    tooltip: css`
      display: flex;
    `,
    infoIcon: css`
      cursor: help;
    `,
    toggle: css`
      margin-left: ${theme.spacing(2)};
    `,
    tabletButtonGroup: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    tabletSearchTextField: css`
      width: 100%;
      margin-bottom: ${theme.spacing(6)};
    `,
    desktopSearchTextField: css`
      margin-left: ${theme.spacing(8)};
      min-width: ${theme.spacing(75)};
    `,
    mobileSelectContainer: css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(6)};
      }
    `,
    mobileSelectLabel: css`
      flex-shrink: 0;
      margin-right: ${theme.spacing(3)};
    `,
    mobileSelect: css`
      width: ${theme.spacing(41)};
    `,
  };
};
