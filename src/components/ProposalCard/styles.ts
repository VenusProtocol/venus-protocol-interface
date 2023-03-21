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
    link: css`
      :hover {
        text-decoration: none;
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
    cardHeaderLeft: css`
      display: flex;
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
  };
};
