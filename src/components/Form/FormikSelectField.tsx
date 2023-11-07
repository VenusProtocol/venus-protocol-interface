import { useField } from 'formik';
import React from 'react';

import { Select, SelectProps } from '../Select';

interface FormikSelectFieldProps extends Omit<SelectProps, 'name' | 'onChange' | 'value'> {
  name: string;
  displayableErrorCodes?: string[];
}

export const FormikSelectField = ({ name, onBlur, ...rest }: FormikSelectFieldProps) => {
  const [{ value, onBlur: formikOnBlur }, _formState, { setValue }] = useField(name); // eslint-disable-line @typescript-eslint/naming-convention

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    if (onBlur) {
      onBlur(value);
    }
    formikOnBlur(e);
  };

  return <Select value={value} onChange={setValue} onBlur={handleBlur} {...rest} />;
};
