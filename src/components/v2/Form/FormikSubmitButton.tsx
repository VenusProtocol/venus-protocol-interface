import React from 'react';
import { useFormikContext } from 'formik';
import { Button, IButtonProps } from '../Button';

interface IFormikSubmitButtonProps extends IButtonProps {
  disabledLabel?: string;
  enabledLabel: string;
}

export const FormikSubmitButton = ({
  disabledLabel,
  enabledLabel,
  variant = 'primary',
  disabled,
  ...rest
}: Omit<IFormikSubmitButtonProps, 'type'>) => {
  const { isValid, dirty } = useFormikContext();
  const showDisableLabel = !isValid || !dirty; // loading disabled
  return (
    <Button variant={variant} {...rest} disabled={disabled || showDisableLabel} type="submit">
      {(showDisableLabel && disabledLabel) || enabledLabel}
    </Button>
  );
};
