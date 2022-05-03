/** @jsxImportSource @emotion/react */
import React from 'react';
import { Formik, FormikProps, FormikConfig } from 'formik';

import getValidationSchema, { FormValues } from './validationSchema';

export * from './validationSchema';

export interface IAmountFormProps
  extends Omit<FormikConfig<FormValues>, 'onSubmit' | 'initialValues'> {
  onSubmit: (values: { vrt: string; xvs: string }) => Promise<void> | void;
  children: (formProps: FormikProps<FormValues>) => React.ReactNode;
  initialAmount?: string;
  maxVrt: FormikConfig<FormValues>['initialValues']['vrt'];
  maxXvs: FormikConfig<FormValues>['initialValues']['xvs'];
}

export const ConvertVrtForm: React.FC<IAmountFormProps> = ({
  children,
  onSubmit,
  initialAmount = '',
  maxVrt,
  maxXvs,
}) => {
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={{
        vrt: initialAmount,
        xvs: initialAmount,
      }}
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema({ maxXvs, maxVrt })}
      validateOnMount
      validateOnChange
    >
      {children}
    </Formik>
  );
};
