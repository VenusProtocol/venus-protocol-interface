import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { Variant } from './types';

export const styles = ({ fullWidth, variant }: { fullWidth: boolean; variant: Variant }) => {
  const theme = useTheme();

  const getButtonVariantCss = ({
    variant: refVariant,
    active,
  }: {
    variant: Variant;
    active: boolean;
  }) => {
    if (refVariant === 'secondary') {
      return css`
        border-color: ${theme.palette.button.medium};

        :disabled {
          border-color: ${theme.palette.secondary.light};
        }

        ${!active &&
        css`
          :hover:not(:disabled) {
            background-color: ${theme.palette.button.main};
            border-color: ${theme.palette.button.main};
          }
        `}

        ${active &&
        css`
          background-color: ${theme.palette.button.main};
          border-color: ${theme.palette.button.main};
        `}

        :active:not(:disabled) {
          background-color: ${theme.palette.button.medium};
          border-color: ${theme.palette.button.medium};
        }
      `;
    }

    if (refVariant === 'tertiary') {
      return css`
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
        height: ${theme.spacing(10)};
        background-color: ${theme.palette.secondary.light};
        border-color: ${theme.palette.secondary.light};

        :disabled {
          background-color: ${theme.palette.secondary.light};
          border-color: ${theme.palette.secondary.light};
        }

        ${!active &&
        css`
          :hover:not(:disabled) {
            background-color: ${theme.palette.secondary.light};
            border-color: ${theme.palette.interactive.primary};
          }
        `}

        ${active &&
        css`
          background-color: ${theme.palette.text.secondary};
          border-color: ${theme.palette.text.secondary};
        `}

        :active:not(:disabled) {
          background-color: ${theme.palette.text.secondary};
          border-color: ${theme.palette.text.secondary};
        }
      `;
    }

    if (refVariant === 'quaternary') {
      return css`
        padding: ${theme.spacing(1, 6)};
        height: ${theme.spacing(8)};
        border-radius: ${theme.spacing(5)};
        background-color: ${theme.palette.secondary.light};
        border-color: ${theme.palette.secondary.light};

        :disabled {
          background-color: ${theme.palette.secondary.light};
          border-color: ${theme.palette.secondary.light};
        }

        ${!active &&
        css`
          :hover:not(:disabled) {
            background-color: ${theme.palette.secondary.light};
            border-color: ${theme.palette.interactive.primary};
          }
        `}

        ${active &&
        css`
          background-color: ${theme.palette.text.secondary};
          border-color: ${theme.palette.text.secondary};
        `}

        :active:not(:disabled) {
          background-color: ${theme.palette.text.secondary};
          border-color: ${theme.palette.text.secondary};
        }
      `;
    }

    if (refVariant === 'quinary') {
      return css`
        padding: ${theme.spacing(1, 5)};
        height: ${theme.spacing(8)};
        background-color: ${theme.palette.background.paper};
        border-color: ${theme.palette.secondary.light};

        :disabled {
          background-color: ${theme.palette.secondary.main};
          border-color: ${theme.palette.secondary.light};
        }

        ${!active &&
        css`
          :hover:not(:disabled) {
            background-color: ${theme.palette.secondary.light};
            border-color: ${theme.palette.secondary.light};
          }
        `}

        ${active &&
        css`
          background-color: ${theme.palette.interactive.primary};
          border-color: ${theme.palette.interactive.primary};
        `}

        :active:not(:disabled) {
          background-color: ${theme.palette.interactive.primary};
          border-color: ${theme.palette.interactive.primary};
        }
      `;
    }

    if (refVariant === 'senary') {
      return css`
        padding: ${theme.spacing(1, 2)};
        height: ${theme.spacing(8)};
        background-color: ${theme.palette.background.paper};
        border-color: ${theme.palette.secondary.light};

        :disabled {
          background-color: ${theme.palette.secondary.main};
          border-color: ${theme.palette.secondary.light};
        }

        ${!active &&
        css`
          :hover:not(:disabled) {
            background-color: ${theme.palette.secondary.main};
            border-color: ${theme.palette.interactive.primary};
          }
        `}

        ${active &&
        css`
          background-color: ${theme.palette.secondary.main};
          border-color: ${theme.palette.interactive.primary};
        `}

        :active:not(:disabled) {
          background-color: ${theme.palette.secondary.main};
          border-color: ${theme.palette.interactive.primary};
        }
      `;
    }

    if (refVariant === 'text') {
      return css`
        background-color: transparent;
        color: ${theme.palette.button.main};

        ${!active &&
        css`
          :hover:not(:disabled) {
            color: ${theme.palette.button.medium};
          }
        `}

        ${active &&
        css`
          color: ${theme.palette.button.medium};
        `}

        :active:not(:disabled) {
          color: ${theme.palette.button.dark};
        }
      `;
    }

    // Primary variant
    return css`
      background-color: ${theme.palette.button.main};
      border-color: ${theme.palette.button.main};

      :disabled {
        background-color: ${theme.palette.secondary.light};
        border-color: ${theme.palette.secondary.light};
      }

      ${!active &&
      css`
        :hover:not(:disabled) {
          background-color: ${theme.palette.button.medium};
          border-color: ${theme.palette.button.medium};
        }
      `}

      ${active &&
      css`
        background-color: ${theme.palette.button.medium};
        border-color: ${theme.palette.button.medium};
      `}

      :active:not(:disabled) {
        background-color: ${theme.palette.button.dark};
        border-color: ${theme.palette.button.dark};
      }
    `;
  };

  return {
    getButton: ({ disabled, active }: { disabled: boolean; active: boolean }) => css`
      border-radius: 8px;
      padding: ${theme.spacing(2, 6)};
      height: ${theme.spacing(12)};
      border: 1px solid transparent;
      background-color: transparent;
      box-shadow: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${theme.palette.text.primary};
      transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

      :disabled {
        color: ${theme.palette.text.secondary};
      }

      ${!disabled &&
      css`
        cursor: pointer;
      `}

      ${fullWidth &&
      css`
        width: 100%;
      `};

      ${getButtonVariantCss({ variant, active })};
    `,
    loadingIcon: css`
      margin-right: ${theme.spacing(2)};
      margin-top: -3px;
      margin-bottom: -3px;
    `,
    label: css`
      display: inline-flex;
      align-items: center;
      font-weight: 600;
      color: inherit;
      font-size: ${variant === 'primary' || variant === 'secondary'
        ? theme.typography.body1.fontSize
        : theme.typography.small1.fontSize};
    `,
    link: css`
      font-weight: 600;

      &:hover {
        text-decoration: none;
      }
    `,
  };
};

export default styles;
