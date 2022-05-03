import * as yup from 'yup';

export type FormValues = yup.InferType<ReturnType<typeof getValidationSchema>>;

export enum ErrorCode {
  NOT_POSITIVE = 'NOT_POSITIVE', // value must be positive
  HIGHER_THAN_MAX = 'HIGHER_THAN_MAX', // value must be lower or equal to max
}

const getValidationSchema = ({ maxVrt, maxXvs }: { maxVrt: string; maxXvs: string }) =>
  yup.object({
    vrt: yup
      .string()
      .required()
      .test('isPositive', ErrorCode.NOT_POSITIVE, value => !!value && +value > 0)
      .test(
        'isHigherThanMax',
        ErrorCode.HIGHER_THAN_MAX,
        value => !value || !maxVrt || +value <= +maxVrt,
      ),
    xvs: yup
      .string()
      .required()
      .test('isPositive', ErrorCode.NOT_POSITIVE, value => !!value && +value > 0)
      .test(
        'isHigherThanMax',
        ErrorCode.HIGHER_THAN_MAX,
        value => !value || !maxXvs || +value <= +maxXvs,
      ),
  });

export default getValidationSchema;
