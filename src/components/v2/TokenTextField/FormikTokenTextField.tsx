import React from 'react';
import { useField } from 'formik';
import { TokenTextField, ITokenTextFieldProps } from '.';

interface IFormikTokenTextField extends Omit<ITokenTextFieldProps, 'name' | 'onChange' | 'value'> {
  name: string;
  errorCodes?: string[];
}

export const FormikTokenTextField = ({ name, errorCodes = [], ...rest }: IFormikTokenTextField) => {
  const [{ value, onBlur }, { error }, { setValue }] = useField(name); // eslint-disable-line  @typescript-eslint/no-unused-vars
  const onChange = (val: string) => {
    setValue(val);
  };
  return (
    <TokenTextField
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      hasError={!!(error && errorCodes.includes(error))}
      {...rest}
    />
  );
};
