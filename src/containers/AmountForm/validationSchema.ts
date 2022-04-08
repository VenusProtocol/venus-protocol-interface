import BigNumber from 'bignumber.js';
import * as yup from 'yup';

export type FormValues = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  amount: yup
    .mixed<'' | BigNumber>()
    .required()
    .test(
      'isPositiveBigNumber',
      'value must be positive',
      value => value instanceof BigNumber && value.isGreaterThan(0),
    ),
});

export default validationSchema;
