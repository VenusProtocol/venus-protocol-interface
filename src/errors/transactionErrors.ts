import type { TransactionReceipt } from 'web3-core';
import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
  VAIControllerErrorReporterError,
  VAIControllerErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VError, IVErrorPhraseMap } from './VError';

const checkForTransactionError = (
  receipt: TransactionReceipt,
  errorEnum:
    | typeof ComptrollerErrorReporterError
    | typeof TokenErrorReporterError
    | typeof VAIControllerErrorReporterError,
  infoEnum:
    | typeof ComptrollerErrorReporterFailureInfo
    | typeof TokenErrorReporterFailureInfo
    | typeof VAIControllerErrorReporterFailureInfo,
) => {
  if (receipt.events?.Failure) {
    const { error, info } = receipt.events?.Failure.returnValues;
    throw new VError({
      type: 'transaction',
      code: errorEnum[error] as IVErrorPhraseMap['transaction'],
      data: {
        error: errorEnum[error] as IVErrorPhraseMap['transaction'],
        info: infoEnum[info] as IVErrorPhraseMap['transaction'],
      },
    });
  }
  return receipt;
};

export const checkForComptrollerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    ComptrollerErrorReporterError,
    ComptrollerErrorReporterFailureInfo,
  );

export const checkForTokenTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(receipt, TokenErrorReporterError, TokenErrorReporterFailureInfo);

export const checkForVaiControllerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    VAIControllerErrorReporterError,
    VAIControllerErrorReporterFailureInfo,
  );
