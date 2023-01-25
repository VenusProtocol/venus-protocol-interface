import { utils as etherUtils } from 'ethers';
import * as yup from 'yup';

export type FormValues = yup.InferType<typeof addressValidationSchema>;

export enum ErrorCode {
  NOT_VALID = 'NOT_VALID', // value must be a valid address
}

const addressValidationSchema = yup.object({
  address: yup
    .string()
    .required()
    .test('isAddress', ErrorCode.NOT_VALID, value => etherUtils.isAddress(value as string)),
});

export default addressValidationSchema;
