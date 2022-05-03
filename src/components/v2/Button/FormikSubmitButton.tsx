import React from 'react';
import { useFormikContext } from 'formik';
import { PrimaryButton, IButtonProps } from '.';

interface IFormikSubmitButtonProps extends IButtonProps {
  disabled?: boolean;
  loading: boolean;
  disabledLabel?: string;
  enabledLabel: string;
}

export const FormikSubmitButton = ({
  disabledLabel,
  enabledLabel,
  variant = 'primary',
  disabled = false,
  loading = false,
  ...rest
}: IFormikSubmitButtonProps) => {
  const { isValid, dirty } = useFormikContext();
  const disable = !isValid || !dirty;
  return (
    <PrimaryButton
      variant={variant}
      {...rest}
      disabled={disabled || disable}
      type="submit"
      loading={loading}
    >
      {(disable && disabledLabel) || enabledLabel}
    </PrimaryButton>
  );
};
