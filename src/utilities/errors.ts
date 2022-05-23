import type { TransactionReceipt } from 'web3-core';
import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
  VAIControllerErrorReporterError,
  VAIControllerErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';

export class UiError extends Error {
  title: string;

  description?: string;

  constructor(title: string, description?: string) {
    super(title);
    this.title = title;

    if (description) {
      this.description = description;
    }
  }
}

export class InternalError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class TransactionError extends Error {
  info: string;

  error: string;

  description: string;

  constructor(error: string, info: string) {
    super(error);
    this.error = error;
    this.info = info;
    this.description = info;
  }
}

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
    throw new TransactionError(errorEnum[error], infoEnum[info]);
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
