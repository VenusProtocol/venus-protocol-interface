import { css, useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
    `,
    getCircle: ({ circumference, offset }: { circumference: number; offset: number }) => css`
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      stroke-dasharray: ${circumference} ${circumference};
      stroke-dashoffset: ${offset};
      stroke-width: 2px;
    `,
    circleBackground: css`
      stroke: rgba(255, 255, 255, 0.12);
      stroke-width: 2px;
    `,
  };
};

export default useStyles;
