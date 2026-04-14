import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const theme = useTheme();

  let sizeNum = 6;
  if (size === 'md') {
    sizeNum = 5;
  } else if (size === 'sm') {
    sizeNum = 4;
  }

  return {
    root: css`
      padding: 0;

      svg {
        height: ${theme.spacing(sizeNum)};
        width: ${theme.spacing(sizeNum)};
      }
      :hover {
        svg {
          color: ${theme.palette.interactive.primary};
        }
      }
    `,
  };
};

export default useStyles;
