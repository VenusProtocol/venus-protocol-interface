import { useFormikContext } from 'formik';
import React from 'react';

import { Button, ButtonProps } from '../Button';

interface FormikSubmitButtonProps extends ButtonProps {
  disabledLabel?: string;
  enabledLabel: string;
}

export const FormikSubmitButton = ({
  disabledLabel,
  enabledLabel,
  variant = 'primary',
  disabled,
  ...rest
}: Omit<FormikSubmitButtonProps, 'type'>) => {
  const { isValid } = useFormikContext();
  const showDisableLabel = !isValid;

  return (
    <Button variant={variant} {...rest} disabled={disabled || showDisableLabel} type="submit">
      {(showDisableLabel && disabledLabel) || enabledLabel}
    </Button>
  );
};
