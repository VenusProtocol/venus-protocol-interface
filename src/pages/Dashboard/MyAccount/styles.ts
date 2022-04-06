import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useMyAccountStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      padding: ${theme.spacing(3)};
    `,
    row: css`
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    apyWithXvs: css`
      display: flex;
      align-items: center;
    `,
    tooltip: css`
      display: flex;
    `,
    iconInfo: css`
      margin-left: ${theme.spacing(1)};
      margin-right: ${theme.spacing(1)};
    `,
    toggle: css`
      margin-left: ${theme.spacing(1)};
    `,
    labelListItem: css`
      margin-bottom: ${theme.spacing(0.7)};
    `,
    inline: css`
      display: inline-block;
    `,
    netApyLabel: css`
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: ${theme.spacing(3)};
    `,
    list: css`
      padding-left: 0;
      display: flex;
      margin-bottom: ${theme.spacing(3)};
      margin-top: ${theme.spacing(1)};

      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    item: css`
      list-style: none;
      padding-left: ${theme.spacing(4)};
      padding-right: ${theme.spacing(4)};
      border-left: 1px solid ${theme.palette.secondary.light};
      border-right: 1px solid ${theme.palette.secondary.light};

      ${theme.breakpoints.down('sm')} {
        border: none;
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;

        & + & {
          margin-top: ${theme.spacing(1)};
        }
      }

      :first-child {
        border-left: none;
        padding-left: 0;
      }
      :last-child {
        border-right: none;
        padding-right: 0;
      }
    `,
    borrowLimitLabelWrapper: css`
      display: flex;
    `,
    borrowLimitLabel: css`
      margin-right: ${theme.spacing(0.5)};
    `,
    bottom: css`
      display: flex;
      justify-content: flex-end;
      align-items: center;
    `,
    safeLimit: css`
      margin-left: ${theme.spacing(1)};
      margin-right: ${theme.spacing(1)};
    `,
  };
};
