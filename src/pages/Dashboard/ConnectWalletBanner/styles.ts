import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-bottom: ${theme.spacing(8)};
      display: flex;
      padding: 0;
      overflow: hidden;
      border: 1px ${theme.palette.secondary.light} solid;

      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    content: css`
      flex: 4;
      padding: ${theme.spacing(10)};

      ${theme.breakpoints.down('lg')} {
        flex: 5;
      }

      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(6)};
      }

      ${theme.breakpoints.down('sm')} {
        flex: initial;
        padding: ${theme.spacing(6, 4)};
        text-align: center;
      }
    `,
    title: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    description: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    button: css`
      ${theme.breakpoints.down('sm')} {
        margin: 0 auto;
        width: 100%;
      }
    `,
    illustrationContainer: css`
      position: relative;
      flex: 5;

      ${theme.breakpoints.down('lg')} {
        flex: 4;
      }

      ${theme.breakpoints.down('sm')} {
        height: ${theme.spacing(59)};
        flex: initial;
        order: -1;
        overflow: hidden;
        background-color: #313239;
      }
    `,
    illustration: css`
      position: absolute;
      height: ${theme.spacing(219)};
      top: ${theme.spacing(-45)};
      left: ${theme.spacing(-18)};

      ${theme.breakpoints.down('xl')} {
        height: ${theme.spacing(156)};
        top: ${theme.spacing(-15)};
        left: ${theme.spacing(-10)};
      }

      ${theme.breakpoints.down('lg')} {
        height: ${theme.spacing(112)};
        top: 0;
        left: ${theme.spacing(-6)};
      }

      ${theme.breakpoints.down('sm')} {
        height: auto;
        width: ${theme.spacing(102)};
        left: auto;
        right: 50%;
        margin-right: ${theme.spacing(-57)};
      }
    `,
  };
};
