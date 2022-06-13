import * as yup from 'yup';
import web3 from 'web3';

export type FormValues = yup.InferType<typeof proposalSchema>;

export enum ErrorCode {
  ACTION_ADDRESS_NOT_VALID = 'ACTION_ADDRESS_NOT_VALID', // value must be a valid address
}

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
        signature: yup.string().required(),
      }),
    )
    .required(),
  description: yup.string().required(),
});

export default proposalSchema;
