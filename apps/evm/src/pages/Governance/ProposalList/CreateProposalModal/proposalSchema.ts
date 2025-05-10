import * as yup from 'yup';

import { parseFunctionSignature } from 'utilities';
import { encodeAbiParameters, isAddress } from 'viem';

import { safeJsonParse } from './safeJsonParse';

export enum ErrorCode {
  ACTION_ADDRESS_NOT_VALID = 'ACTION_ADDRESS_NOT_VALID', // value must be a valid address
  VALUE_REQUIRED = 'VALUE_REQUIRED', // value required
  SIGNATURE_NOT_VALID = 'SIGNATURE_NOT_VALID', // must be formated and arguments need to be valid solidity types
  CALL_DATA_ARGUMENT_INVALID = 'CALL_DATA_ARGUMENT_INVALID,',
}

const proposalSchema = yup.object({
  actions: yup
    .array()
    .of(
      yup.object({
        target: yup
          .string()
          .required()
          .test('isAddress', ErrorCode.ACTION_ADDRESS_NOT_VALID, value => isAddress(value)),
        signature: yup
          .string()
          .test({
            name: 'isValidSignature',
            message: ErrorCode.SIGNATURE_NOT_VALID,
            test(signature, context) {
              if (signature === '') {
                // if signature is an empty string, we accept it if there is a value and no callData
                // @ts-expect-error The yup type doesn't show this value exists but it does
                const { value, callData } = context.options.from[0].value;
                return value && value !== '0' && callData.length === 0;
              }
              return !!parseFunctionSignature(signature);
            },
          })
          .default(''),
        value: yup.string().required().default('0'),
        callData: yup
          .array()
          .of(
            yup
              .string()
              .default('')
              .test({
                name: 'validArguments',
                message: ErrorCode.CALL_DATA_ARGUMENT_INVALID,
                test(value) {
                  let valid = true;
                  try {
                    const dataTypes =
                      // @ts-expect-error The yup type doesn't show this value exists but it does
                      parseFunctionSignature(this.options.from[0].value.signature)?.inputs || [];

                    encodeAbiParameters(
                      // @ts-expect-error The yup type doesn't show this value exists but it does
                      [dataTypes[this.options.index]],
                      [safeJsonParse(value || '')],
                    );
                  } catch {
                    valid = false;
                  }
                  return valid;
                },
              }),
          )
          .test({
            name: 'min',
            message: ErrorCode.VALUE_REQUIRED,
            test(value) {
              const fragment = parseFunctionSignature(this.parent.signature);
              const min = fragment?.inputs.length ?? 0;
              const filteredValue = value?.filter(v => v !== undefined && v !== null);
              return !!(filteredValue && filteredValue.length >= min);
            },
          })
          .required(ErrorCode.VALUE_REQUIRED),
      }),
    )
    .required(ErrorCode.VALUE_REQUIRED),
  title: yup.string().required(ErrorCode.VALUE_REQUIRED),
  description: yup.string().required(ErrorCode.VALUE_REQUIRED),
  forDescription: yup.string().required(ErrorCode.VALUE_REQUIRED),
  againstDescription: yup.string().required(ErrorCode.VALUE_REQUIRED),
  abstainDescription: yup.string().required(ErrorCode.VALUE_REQUIRED),
  proposalType: yup.number().oneOf([0, 1, 2]).required(ErrorCode.VALUE_REQUIRED),
});

export type FormValues = yup.InferType<typeof proposalSchema>;

export const initialActionData: FormValues['actions'][number] = {
  target: '',
  signature: '',
  value: '0',
  callData: [],
};

export default proposalSchema;
