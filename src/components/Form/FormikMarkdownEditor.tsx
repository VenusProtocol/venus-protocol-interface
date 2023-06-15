import { useField } from 'formik';
import React from 'react';

import { MarkdownEditor, MarkdownEditorProps } from '../Markdown';

export interface FormikMarkdownEditorProps
  extends Omit<MarkdownEditorProps, 'name' | 'onChange' | 'value' | 'onBlur'> {
  name: string;
  displayableErrorCodes?: string[];
}

export const FormikMarkdownEditor = ({
  name,
  displayableErrorCodes = [],
  ...rest
}: FormikMarkdownEditorProps) => {
  const [{ value, onBlur }, { error, touched }, { setValue }] = useField(name);
  const onChange = (val: string | undefined) => {
    setValue(val);
  };

  return (
    <MarkdownEditor
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      hasError={!!(error && displayableErrorCodes.includes(error) && touched)}
      {...rest}
    />
  );
};
