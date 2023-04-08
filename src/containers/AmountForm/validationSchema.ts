import * as yup from 'yup';

export type FormValues = yup.InferType<ReturnType<typeof getValidationSchema>>;

export enum ErrorCode {
  NOT_POSITIVE = 'NOT_POSITIVE', // value must be positive
  HIGHER_THAN_MAX = 'HIGHER_THAN_MAX', // value must be lower or equal to max
}

const getValidationSchema = (maxAmount?: string) =>
  yup.object({
    amount: yup
      .string()
      .positive(ErrorCode.NOT_POSITIVE)
      .lowerThanOrEqualTo(maxAmount, ErrorCode.HIGHER_THAN_MAX)
      .required(),
  });

export default getValidationSchema;
