/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import { Link, LinkProps } from 'react-router-dom';

import { Spinner } from '../Spinner';
import useStyles from './styles';
import { Variant } from './types';

export interface IBaseButtonProps {
  fullWidth?: boolean;
  small?: boolean;
  variant?: Variant;
}

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    IBaseButtonProps {
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
}: IButtonProps) => {
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

export const PrimaryButton = (props: IButtonProps) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props: IButtonProps) => <Button variant="secondary" {...props} />;
export const TertiaryButton = (props: IButtonProps) => <Button variant="tertiary" {...props} />;
export const TextButton = (props: IButtonProps) => <Button variant="text" {...props} />;
export const LinkButton = ({
  variant = 'primary',
  fullWidth = false,
  small = false,
  ...props
}: LinkProps & IBaseButtonProps) => {
  const styles = useStyles({ fullWidth, variant, small });
  return <Link {...props} css={[styles.getButton({ disabled: false }), styles.link]} />;
};
