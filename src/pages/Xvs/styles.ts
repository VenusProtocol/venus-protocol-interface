import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    header: css`
      margin-bottom: ${theme.spacing(6)};
      padding: ${theme.spacing(8)};
      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(6)};
      }
      ${theme.breakpoints.down('sm')} {
        padding: ${theme.spacing(4)};
      }
    `,
    headerRoot: css`
      display: inline-flex;
      flex-direction: row;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      ${theme.breakpoints.down('md')} {
        flex-direction: column-reverse;
        align-items: flex-start;
      }
    `,
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    copyIcon: css`
      color: ${theme.palette.button.main};
    `,
    addressText: css`
      margin: 0 ${theme.spacing(3)};
    `,
    address: css`
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      max-width: 35%;
      ${theme.breakpoints.down('xl')} {
        max-width: 26%;
      }
      ${theme.breakpoints.down('lg')} {
        max-width: 20%;
      }
      ${theme.breakpoints.down('md')} {
        max-width: calc(100% - ${theme.shape.iconSize.large}px - ${theme.shape.iconSize.xLarge}px);
        justify-content: flex-start;
      }
    `,
    addressContainer: css`
      display: flex;
      align-items: center;
    `,
    xvsIconContainer: css`
      height: ${theme.shape.iconSize.large}px;
      width: ${theme.shape.iconSize.large}px;
    `,
    copyIconContainer: css`
      height: ${theme.shape.iconSize.xLarge}px;
      width: ${theme.shape.iconSize.xLarge}px;
      cursor: pointer;
      &:hover > svg {
        color: ${theme.palette.button.medium};
      }
    `,
    icon: css`
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
    `,
    iconSizeXl: `${theme.shape.iconSize.xLarge}px`,
    slider: css`
      justify-content: flex-end;
      flex: 1;
      max-width: 50%;
      ${theme.breakpoints.down('xl')} {
        max-width: 64%;
      }
      ${theme.breakpoints.down('lg')} {
        max-width: 70%;
      }
      ${theme.breakpoints.down('md')} {
        padding-bottom: ${theme.spacing(6)};
        max-width: 100%;
        width: 100%;
      }
    `,
    progressBar: css`
      margin-bottom: ${theme.spacing(1.5)};
      > div {
        > span:last-of-type {
          font-weight: 400;
        }
      }
    `,
    fontWeight400: css`
      font-weight: 400;
    `,
    cardContentGrid: css`
      .table__table-cards__card-content {
        grid-template-columns: 1fr 1fr minmax(${theme.spacing(30)}, 1fr);
        grid-template-rows: 1fr;
      }
    `,
  };
};
