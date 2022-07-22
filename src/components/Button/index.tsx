/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Spinner } from '../Spinner';
import useStyles from './styles';
import { Variant } from './types';

export interface BaseButtonProps {
  fullWidth?: boolean;
  small?: boolean;
  variant?: Variant;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps {
  loading?: boolean;
}

export const Button = ({
  className,
  loading,
  disabled = false,
  fullWidth = false,
  small = false,
  variant = 'primary',
  children,
  ...otherProps
}: ButtonProps) => {
  const styles = useStyles({ fullWidth, variant, small });

  return (
    <button
      css={styles.getButton({ disabled })}
      className={className}
      disabled={loading || disabled}
      type="button"
      {...otherProps}
    >
      {loading && (
        <div css={styles.loadingIcon}>
          <Spinner variant="small" />
        </div>
      )}

      <Typography css={styles.label} component="span" variant={small ? 'small1' : 'body1'}>
        {children}
      </Typography>
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props: ButtonProps) => <Button variant="secondary" {...props} />;
export const TertiaryButton = (props: ButtonProps) => <Button variant="tertiary" {...props} />;
export const TextButton = (props: ButtonProps) => <Button variant="text" {...props} />;
export const LinkButton = ({
  variant = 'primary',
  fullWidth = false,
  small = false,
  ...props
}: LinkProps & BaseButtonProps) => {
  const styles = useStyles({ fullWidth, variant, small });
  return <Link {...props} css={[styles.getButton({ disabled: false }), styles.link]} />;
};

export const AnchorButton = ({
  variant = 'primary',
  fullWidth = false,
  small = false,
  children,
  ...props
}: BaseButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const styles = useStyles({ fullWidth, variant, small });
  return (
    <a
      target="_blank"
      rel="noreferrer"
      {...props}
      css={[styles.getButton({ disabled: false }), styles.link]}
    >
      {children}
    </a>
  );
};
