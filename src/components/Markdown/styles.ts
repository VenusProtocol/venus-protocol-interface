import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    hasError: (hasError: boolean | undefined) => css`
      ${hasError &&
      `
        border: 1px solid ${theme.palette.interactive.error};
        .w-md-editor-preview {
          border-bottom: 1px solid ${theme.palette.interactive.error};
          bottom: 1px;
        }
      `};
    `,
  };
};
