import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      flex: 1;
      margin-left: ${theme.spacing(4)};
      ${theme.breakpoints.down('lg')} {
        margin-left: 0;
      }
    `,
    actionButton: css`
      width: 100%;
      ${theme.breakpoints.down('lg')} {
        width: auto;
      }
      ${theme.breakpoints.down('sm')} {
        width: 100%;
      }
    `,
    clickableText: css`
      color: ${theme.palette.interactive.primary};
      :hover {
        color: ${theme.palette.text.primary};
        cursor: pointer;
      }
    `,
    votingWeightContainer: css`
      padding-bottom: ${theme.spacing(4)};
      ${theme.breakpoints.down('lg')} {
        border-right: 1px solid ${theme.palette.interactive.delimiter};
        padding-right: ${theme.spacing(10)};
        padding-bottom: 0;
      }
      ${theme.breakpoints.down('sm')} {
        border-right: none;
        padding-bottom: ${theme.spacing(4)};
      }
    `,
    totalLockedContainer: css`
      margin: ${theme.spacing(4)} 0 ${theme.spacing(5)} 0;
      ${theme.breakpoints.down('lg')} {
        margin-bottom: 0;
      }
      ${theme.breakpoints.down('sm')} {
        margin-bottom: ${theme.spacing(5)};
      }
    `,
    tokenIcon: css`
      height: ${theme.spacing(6.5)};
      width: ${theme.spacing(6.5)};
    `,
    totalLockedValue: css`
      display: flex;
      flex-direction: row;
      padding-bottom: ${theme.spacing(2)};
    `,
    totalLockedText: css`
      margin-right: ${theme.spacing(2)};
    `,
    voteSection: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${theme.spacing(6)};
      ${theme.breakpoints.down('lg')} {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
    `,
    subtitle: css`
      margin-bottom: ${theme.spacing(1)};
      ${theme.breakpoints.down('md')} {
        font-size: ${theme.typography.small1.fontSize};
      }
      ${theme.breakpoints.down('sm')} {
        font-size: ${theme.typography.body1.fontSize};
      }
    `,
    value: css`
      ${theme.breakpoints.down('md')} {
        font-size: ${theme.typography.h4.fontSize};
      }
      ${theme.breakpoints.down('sm')} {
        font-size: ${theme.typography.h3.fontSize};
      }
    `,
    votingWalletPaper: css`
      display: flex;
      flex-direction: column;
      margin-top: ${theme.spacing(6)};
      ${theme.breakpoints.down('lg')} {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
    `,
    toVote: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    depositTokens: css`
      margin-bottom: ${theme.spacing(3)};
    `,
    delimiter: css`
      ${theme.breakpoints.down('lg')} {
        display: none;
      }
      ${theme.breakpoints.down('sm')} {
        display: block;
        width: 100%;
      }
    `,
    infoIcon: css`
      display: flex;
      align-self: center;
    `,
    totalLockedTitle: css`
      display: flex;
      flex-direction: row;
      align-items: flex-end;
    `,
  };
};
