/** @jsxImportSource @emotion/react */
import React from 'react';
import { Formik, Form, FormikProps, FormikConfig } from 'formik';

import validationSchema, { FormValues } from './validationSchema';

export interface IAmountFormProps
  extends Omit<FormikConfig<FormValues>, 'onSubmit' | 'initialValues'> {
  onSubmit: (value: string) => Promise<void> | void;
  children: (formProps: FormikProps<FormValues>) => React.ReactNode;
  initialValues?: FormikConfig<FormValues>['initialValues'];
  className?: string;
}

export const AmountForm: React.FC<IAmountFormProps> = ({
  children,
  onSubmit,
  className,
  initialValues = { amount: '' },
}) => {
  const handleSubmit = (values: FormValues) => {
    if (values.amount) {
      onSubmit(values.amount);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnMount
      validateOnChange
    >
      {formikProps => <Form className={className}>{children(formikProps)}</Form>}
    </Formik>
  );
};
