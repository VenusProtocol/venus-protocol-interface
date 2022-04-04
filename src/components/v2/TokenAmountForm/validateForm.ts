import { FormValues } from './types';

const validateForm = (values: FormValues) => {
  const errors: {
    amount?: string;
  } = {};

  if (!values.amount || values.amount.isEqualTo(0)) {
    errors.amount = 'required';
  }

  return errors;
};

export default validateForm;
