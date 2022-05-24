import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      width: 100%;
    `,
    header: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: ${theme.spacing(6)};
    `,
    title: css`
      display: flex;
      align-items: center;
    `,
    tokenIcon: css`
      width: 20px;
      height: 20px;
      margin-right: ${theme.spacing(1)};
    `,
    tokenIconLarge: css`
      width: 32px;
      height: 32px;
    `,
    tokenIconReward: css`
      margin-left: ${theme.spacing(1)};
    `,
    text: css`
      display: inline;
    `,
    textMobile14: css`
      ${theme.breakpoints.down('sm')} {
        font-size: 14px;
      }
    `,
    textRewardValue: css`
      font-weight: 600;
    `,
    textStakingValue: css`
      display: inline-flex;
      align-items: center;
    `,
    textAligned: css`
      display: inline-flex;
      align-items: center;
    `,
    rewardWrapper: css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('sm')} {
        font-size: 14px;
      }
    `,
    buttonClaim: css`
      padding: 0;
      margin-left: ${theme.spacing(3)};
    `,
    dataRow: css`
      display: flex;
      padding-left: 0;
      margin-top: ${theme.spacing(6)};
      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    valueWrapper: css`
      display: block;

      ${theme.breakpoints.down('sm')} {
        display: flex;
        justify-content: space-between;
      }

      & + & {
        border-left: 1px solid ${theme.palette.interactive.delimiter};
        margin-left: ${theme.spacing(8)};
        padding-left: ${theme.spacing(8)};

        ${theme.breakpoints.down('sm')} {
          margin-left: 0;
          padding-left: 0;
          border: none;
          margin-top: ${theme.spacing(2)};
        }
      }
    `,
    buttonsWrapper: css`
      display: flex;
      justify-content: space-between;
      margin-top: ${theme.spacing(8)};

      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
        margin-top: ${theme.spacing(4)};
      }
    `,
    button: css`
      width: calc(50% - ${theme.spacing(2)});

      ${theme.breakpoints.down('sm')} {
        width: 100%;
        margin-top: ${theme.spacing(3)};
      }
    `,
  };
};
