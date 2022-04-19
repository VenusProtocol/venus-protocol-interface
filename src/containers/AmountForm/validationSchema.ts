import * as yup from 'yup';

export type FormValues = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  amount: yup
    .string()
    .required()
    .test('isPositive', 'value must be positive', value => !!value && +value > 0),
});

export default validationSchema;
