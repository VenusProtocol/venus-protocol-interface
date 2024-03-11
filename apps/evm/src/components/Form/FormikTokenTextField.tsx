import { useField } from 'formik';

import { TokenTextField, type TokenTextFieldProps } from '../TokenTextField';

interface FormikTokenTextFieldProps
  extends Omit<TokenTextFieldProps, 'name' | 'onChange' | 'value'> {
  name: string;
  displayableErrorCodes?: string[];
}

export const FormikTokenTextField = ({
  name,
  displayableErrorCodes = [],
  ...rest
}: FormikTokenTextFieldProps) => {
  const [{ value, onBlur }, { error }, { setValue }] = useField(name);
  const onChange = (val: string) => {
    setValue(val);
  };
  return (
    <TokenTextField
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      hasError={!!(error && displayableErrorCodes.includes(error))}
      {...rest}
    />
  );
};
