import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    arrow: (expanded: boolean) => css`
      margin-right: ${theme.spacing(4.5)};
      height: ${theme.spacing(3)};
      width: ${theme.spacing(3)};
      color: ${theme.palette.text.primary};
      ${!expanded && 'transform: rotate(180deg)'};
    `,
    iconButton: css`
      cursor: pointer;
      background-color: transparent;
      border: 0;
      display: flex;
      align-items: center;
    `,
    accordionRoot: css`
      padding: 0;
      margin-bottom: ${theme.spacing(3)};
      ::before {
        display: none;
      }
      &.Mui-expanded {
        margin: 0;
      }
    `,
    accordionSummary: css`
      display: flex;
      flex-direction: row;
      min-height: 0 !important;
      padding: 0 !important;

      > div {
        margin: 0 !important;
        justify-content: space-between;
      }
      margin: 0;
    `,
    accordionLeft: css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `,
    content: css`
      margin: ${theme.spacing(3)} 0;
      padding: ${theme.spacing(6)};
      border-radius: ${theme.spacing(4)};
      background-color: ${theme.palette.secondary.light};
    `,
  };
};
