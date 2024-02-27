import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
  useFormState,
} from 'react-hook-form';

import { TokenTextField, TokenTextFieldProps } from 'components';

export type RhfTokenTextFieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  rules?: RegisterOptions;
} & Omit<TokenTextFieldProps, 'value' | 'onChange'>;

export const RhfTokenTextField = <TFormValues extends FieldValues>({
  name,
  rules,
  control,
  ...tokenTextFieldProps
}: RhfTokenTextFieldProps<TFormValues>) => {
  const formState = useFormState({ control });

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TokenTextField
          {...tokenTextFieldProps}
          {...field}
          hasError={fieldState.invalid}
          disabled={field.disabled || formState.isSubmitting || tokenTextFieldProps.disabled}
        />
      )}
    />
  );
};
