import BigNumber from 'bignumber.js';
import * as yup from 'yup';

export type FormValues = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  amount: yup
    .mixed()
    .test(
      'isPositiveBigNumber',
      'required',
      value => value instanceof BigNumber && value.isGreaterThan(0),
    ),
});

export default validationSchema;
