import type { importProposalErrorPhrases } from './importProposalErrorPhrases';
import type { interactionErrorPhrases } from './interactionErrorPhrases';
import type { transactionErrorPhrases } from './transactionErrorPhrases';
import type { unexpectedErrorPhrases } from './unexpectedErrorPhrases';

export interface VErrorParamMap {
  transaction: {
    error: keyof typeof transactionErrorPhrases;
    info: keyof typeof transactionErrorPhrases;
  };
  unexpected: { exception?: unknown } | undefined;
  interaction: { assetName: string; exception?: unknown };
  proposal: {
    info?: string;
  };
}

export interface VErrorPhraseMap {
  transaction: keyof typeof transactionErrorPhrases;
  unexpected: keyof typeof unexpectedErrorPhrases;
  interaction: keyof typeof interactionErrorPhrases;
  proposal: keyof typeof importProposalErrorPhrases;
}

export type ErrorCodes = keyof VErrorParamMap;

export class VError<E extends ErrorCodes> extends Error {
  data: VErrorParamMap[E] | undefined;

  type: E;

  code: VErrorPhraseMap[E];

  errorCallback: (() => void) | undefined;

  constructor({
    type,
    code,
    data,
    errorCallback,
  }: {
    type: E;
    code: VErrorPhraseMap[E];
    data?: VErrorParamMap[E];
    errorCallback?: () => void;
  }) {
    super(code);
    this.type = type;
    this.code = code;
    this.data = data;
    this.errorCallback = errorCallback;
  }
}
