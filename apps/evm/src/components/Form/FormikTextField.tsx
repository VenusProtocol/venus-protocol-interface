import { useField } from 'formik';

import { useEffect } from 'react';
import { TextField, type TextFieldProps } from '../TextField';

interface FormikTextFieldProps extends Omit<TextFieldProps, 'name' | 'onChange' | 'value'> {
  name: string;
  displayableErrorCodes?: string[];
}

export const FormikTextField = ({
  name,
  displayableErrorCodes = [],
  onBlur,
  defaultValue,
  ...rest
}: FormikTextFieldProps) => {
  const [{ value, onBlur: formikOnBlur }, { error, touched }, { setValue }] = useField(name);

  // Set default value on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setValue(value ?? defaultValue ?? '');
  }, [setValue]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const val = e.target.value;
    setValue(val);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    if (onBlur) {
      onBlur(value);
    }
    formikOnBlur(e);
  };

  return (
    <TextField
      name={name}
      value={value !== undefined || value !== null ? value : ''}
      onChange={onChange}
      onBlur={handleBlur}
      defaultValue={defaultValue}
      hasError={!!(error && displayableErrorCodes.includes(error) && touched)}
      {...rest}
    />
  );
};
