import * as yup from 'yup';
import web3 from 'web3';

export type FormValues = yup.InferType<typeof proposalSchema>;

export enum ErrorCode {
  ACTION_ADDRESS_NOT_VALID = 'ACTION_ADDRESS_NOT_VALID', // value must be a valid address
  VALUE_REQUIRED = 'VALUE_REQUIRED', // value must be a valid address
}

// 10 max of ten actions
const proposalSchema = yup.object({
  actions: yup
    .array()
    .of(
      yup.object({
        address: yup
          .string()
          .required()
          .test('isPositive', ErrorCode.ACTION_ADDRESS_NOT_VALID, value =>
            web3.utils.isAddress(value as string),
          ),
        signature: yup.string().required(ErrorCode.VALUE_REQUIRED),
        callData: yup.array().of(yup.string().required(ErrorCode.VALUE_REQUIRED)),
      }),
    )
    .required(ErrorCode.VALUE_REQUIRED)
    .max(10),
  title: yup.string().required(ErrorCode.VALUE_REQUIRED),
  description: yup.string().required(ErrorCode.VALUE_REQUIRED),
});

export default proposalSchema;
