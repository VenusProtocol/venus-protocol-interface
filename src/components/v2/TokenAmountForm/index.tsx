/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Formik, Form, FormikProps, FormikConfig } from 'formik';

export type FormValues = {
  amount: '' | BigNumber;
};

export const initialValues: FormValues = {
  amount: '',
};

export interface ITokenAmountFormProps
  extends Omit<FormikConfig<FormValues>, 'onSubmit' | 'initialValues'> {
  onSubmit: (value: BigNumber) => Promise<void> | void;
  children: (formProps: FormikProps<FormValues>) => React.ReactNode;
  initialValues?: FormikConfig<FormValues>['initialValues'];
}

export const TokenAmountForm: React.FC<ITokenAmountFormProps> = ({ children, onSubmit }) => {
  const handleSubmit = (values: FormValues) => {
    if (values.amount) {
      onSubmit(values.amount);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {formikProps => <Form>{children(formikProps)}</Form>}
    </Formik>
  );
};
