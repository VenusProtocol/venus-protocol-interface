import BigNumber from 'bignumber.js';
import * as yup from 'yup';

export type FormValues = yup.InferType<ReturnType<typeof getValidationSchema>>;

export enum ErrorCode {
  NOT_POSITIVE = 'NOT_POSITIVE', // value must be positive
  HIGHER_THAN_MAX = 'HIGHER_THAN_MAX', // value must be lower or equal to max
}

// TODO: make it a reusable util
const getAmountValidationRule = (maxAmount?: string) =>
  yup
    .string()
    .required()
    .test('isPositive', ErrorCode.NOT_POSITIVE, value => !!value && +value > 0)
    .test(
      'isHigherThanMax',
      ErrorCode.HIGHER_THAN_MAX,
      value => !value || !maxAmount || new BigNumber(value).lte(new BigNumber(maxAmount)),
    );

const getValidationSchema = ({ fromTokenMaxAmount }: { fromTokenMaxAmount?: string }) =>
  yup.object({
    fromTokenAmount: getAmountValidationRule(fromTokenMaxAmount),
    fromTokenId: yup.string().required(),
    toTokenAmount: yup
      .string()
      .required()
      .test('isPositive', ErrorCode.NOT_POSITIVE, value => !!value && +value > 0),
    toTokenId: yup.string().required(),
    direction: yup.string().oneOf(['exactAmountIn', 'exactAmountOut']).required(),
  });

export default getValidationSchema;
