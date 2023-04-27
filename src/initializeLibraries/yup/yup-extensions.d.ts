import * as yup from 'Yup';
import BigNumber from 'bignumber.js';
import { Swap, Token } from 'types';

declare module 'yup' {
  interface StringSchema extends yup.StringSchema {
    positive(error: string): StringSchema;
    lowerThanOrEqualTo(value: BigNumber | string | number | undefined, error: string): StringSchema;
  }

  interface ObjectSchema<T extends object = Token, C = object> extends yup.BaseSchema<T, C> {
    token(): ObjectSchema<Token, C>;
    swap(): ObjectSchema<Swap, C>;
  }
}
