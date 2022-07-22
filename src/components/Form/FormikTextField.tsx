import { useField } from 'formik';
import React from 'react';

import { TextField, TextFieldProps } from '../TextField';

interface FormikTextFieldProps extends Omit<TextFieldProps, 'name' | 'onChange' | 'value'> {
  name: string;
  displayableErrorCodes?: string[];
}

export const FormikTextField = ({
  name,
  displayableErrorCodes = [],
  onBlur,
  ...rest
}: FormikTextFieldProps) => {
  const [{ value, onBlur: formikOnBlur }, { error, touched }, { setValue }] = useField(name);
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
      value={value || ''}
      onChange={onChange}
      onBlur={handleBlur}
      hasError={!!(error && displayableErrorCodes.includes(error) && touched)}
      {...rest}
    />
  );
};
