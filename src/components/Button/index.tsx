/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Spinner } from '../Spinner';
import useStyles from './styles';
import { Variant } from './types';

export interface BaseButtonProps {
  disabled?: boolean;
  active?: boolean;
  fullWidth?: boolean;
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
  variant = 'primary',
  children,
  active = false,
  ...otherProps
}: ButtonProps) => {
  const styles = useStyles({ fullWidth, variant });

  return (
    <button
      css={styles.getButton({ disabled, active })}
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

      <Typography css={styles.label} component="span">
        {children}
      </Typography>
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props: ButtonProps) => <Button variant="secondary" {...props} />;
export const TertiaryButton = (props: ButtonProps) => <Button variant="tertiary" {...props} />;
export const QuaternaryButton = (props: ButtonProps) => <Button variant="quaternary" {...props} />;
export const QuinaryButton = (props: ButtonProps) => <Button variant="quinary" {...props} />;
export const SenaryButton = (props: ButtonProps) => <Button variant="senary" {...props} />;
export const TextButton = (props: ButtonProps) => <Button variant="text" {...props} />;

export const LinkButton = ({
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  active = false,
  ...props
}: LinkProps & BaseButtonProps) => {
  const styles = useStyles({ fullWidth, variant });
  return <Link {...props} css={[styles.getButton({ disabled, active }), styles.link]} />;
};

type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const AnchorButton = ({
  variant = 'primary',
  fullWidth = false,
  children,
  disabled = false,
  active = false,
  ...props
}: AnchorButtonProps) => {
  const styles = useStyles({ fullWidth, variant });
  return (
    <a
      target="_blank"
      rel="noreferrer"
      {...props}
      css={[styles.getButton({ disabled, active }), styles.link]}
    >
      {children}
    </a>
  );
};

export const PrimaryAnchorButton = (props: AnchorButtonProps) => (
  <AnchorButton variant="primary" {...props} />
);

export const SecondaryAnchorButton = (props: AnchorButtonProps) => (
  <AnchorButton variant="secondary" {...props} />
);
