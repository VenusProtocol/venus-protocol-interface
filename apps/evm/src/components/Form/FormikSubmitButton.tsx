import { useFormikContext } from 'formik';

import { Button, type ButtonProps } from '../Button';

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
