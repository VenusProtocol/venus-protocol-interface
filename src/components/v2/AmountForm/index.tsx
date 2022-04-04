/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Formik, Form, FormikProps, FormikConfig } from 'formik';

import { FormValues } from './types';
import validateForm from './validateForm';

export const initialValues: FormValues = {
  amount: '',
};

export interface IAmountFormProps
  extends Omit<FormikConfig<FormValues>, 'onSubmit' | 'initialValues'> {
  onSubmit: (value: BigNumber) => Promise<void> | void;
  children: (formProps: FormikProps<FormValues>) => React.ReactNode;
  initialValues?: FormikConfig<FormValues>['initialValues'];
}

export const AmountForm: React.FC<IAmountFormProps> = ({ children, onSubmit }) => {
  const handleSubmit = (values: FormValues) => {
    if (values.amount) {
      onSubmit(values.amount);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validateForm}
      validateOnMount
    >
      {formikProps => <Form>{children(formikProps)}</Form>}
    </Formik>
  );
};
