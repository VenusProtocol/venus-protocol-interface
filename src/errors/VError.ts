import { interactionErrorPhrases } from './interactionErrorPhrases';
import { transactionErrorPhrases } from './transactionErrorPhrases';
import { unexpectedErrorPhrases } from './unexpectedErrorPhrases';

export interface IVErrorParamMap {
  transaction: {
    error: keyof typeof transactionErrorPhrases;
    info: keyof typeof transactionErrorPhrases;
  };
  unexpected: { message: string } | undefined;
  interaction: { assetName: string };
}

export interface IVErrorPhraseMap {
  transaction: keyof typeof transactionErrorPhrases;
  unexpected: keyof typeof unexpectedErrorPhrases;
  interaction: keyof typeof interactionErrorPhrases;
}

export type ErrorCodes = keyof IVErrorParamMap;

export class VError<E extends ErrorCodes> extends Error {
  data: IVErrorParamMap[E] | undefined;

  type: E;

  code: IVErrorPhraseMap[E];

  constructor({
    type,
    code,
    data,
  }: {
    type: E;
    code: IVErrorPhraseMap[E];
    data?: IVErrorParamMap[E];
  }) {
    super(code);
    this.type = type;
    this.code = code;
    this.data = data;
  }
}
