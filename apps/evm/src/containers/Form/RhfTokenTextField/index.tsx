import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormState,
} from 'react-hook-form';

import { TokenTextField, type TokenTextFieldProps } from 'components';

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
      render={({ field, fieldState }) => {
        const trimmedValue = field.value.trim();
        const isEmpty = typeof field.value === 'string' && Number(trimmedValue || 0) <= 0;
        const hasError = !isEmpty && fieldState.invalid;

        return (
          <TokenTextField
            {...tokenTextFieldProps}
            {...field}
            hasError={hasError}
            disabled={field.disabled || formState.isSubmitting || tokenTextFieldProps.disabled}
            description={
              hasError && fieldState.error ? (
                <p className="text-red">{fieldState.error.message}</p>
              ) : undefined
            }
          />
        );
      }}
    />
  );
};
