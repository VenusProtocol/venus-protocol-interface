import * as yup from 'yup';
import web3 from 'web3';
import { parseFunctionSignature } from 'utilities';

export enum ErrorCode {
  ACTION_ADDRESS_NOT_VALID = 'ACTION_ADDRESS_NOT_VALID', // value must be a valid address
  VALUE_REQUIRED = 'VALUE_REQUIRED', // value required
  SIGNATURE_NOT_VALID = 'SIGNATURE_NOT_VALID', // must be formated and arguments need to be valid solidity types
}

const proposalSchema = yup.object({
  actions: yup
    .array()
    .of(
      yup.object({
        address: yup
          .string()
          .required()
          .test('isAddress', ErrorCode.ACTION_ADDRESS_NOT_VALID, value =>
            web3.utils.isAddress(value as string),
          ),
        signature: yup
          .string()
          .test(
            'isValidSignature',
            ErrorCode.SIGNATURE_NOT_VALID,
            value => !!value && !!parseFunctionSignature(value),
          )
          .required(),
        // @TODO add specific validation and errors for specific types
        callData: yup
          .array()
          .required(ErrorCode.VALUE_REQUIRED)
          .of(yup.string().min(1))
          .test({
            name: 'min',
            message: ErrorCode.VALUE_REQUIRED,
            test(value) {
              const fragment = parseFunctionSignature(this.parent.signature);
              const min = fragment?.inputs.length ?? 0;
              const filteredValue = value?.filter(v => !!v);
              return !!(filteredValue && filteredValue.length >= min);
            },
          }),
      }),
    )
    .required(ErrorCode.VALUE_REQUIRED)
    .max(10),
  title: yup.string().required(ErrorCode.VALUE_REQUIRED),
  description: yup.string().required(ErrorCode.VALUE_REQUIRED),
  forDescription: yup.string().required(ErrorCode.VALUE_REQUIRED),
  againstDescription: yup.string().required(ErrorCode.VALUE_REQUIRED),
  abstainDescription: yup.string().required(ErrorCode.VALUE_REQUIRED),
});

export type FormValues = yup.InferType<typeof proposalSchema>;

export default proposalSchema;
