import React from 'react';
import { useField } from 'formik';
import { TokenTextField, ITokenTextFieldProps } from '../TokenTextField';

interface IFormikTokenTextField extends Omit<ITokenTextFieldProps, 'name' | 'onChange' | 'value'> {
  name: string;
  displayableErrorCodes?: string[];
}

export const FormikTokenTextField = ({
  name,
  displayableErrorCodes = [],
  ...rest
}: IFormikTokenTextField) => {
  const [{ value, onBlur }, { error }, { setValue }] = useField(name);
  const onChange = (val: string) => {
    setValue(val);
  };
  return (
    <TokenTextField
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      hasError={!!(error && displayableErrorCodes.includes(error))}
      {...rest}
    />
  );
};
