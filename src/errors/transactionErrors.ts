import type { TransactionReceipt } from 'web3-core';

import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
  VaiControllerErrorReporterError,
  VaiControllerErrorReporterFailureInfo,
  VaiVaultErrorReporterError,
  VaiVaultErrorReporterInfo,
  XvsVaultProxyErrorReporterError,
  XvsVaultProxyErrorReporterInfo,
} from 'constants/contracts/errorReporter';

import { VError, VErrorPhraseMap } from './VError';

const checkForTransactionError = (
  receipt: TransactionReceipt,
  errorEnum:
    | typeof ComptrollerErrorReporterError
    | typeof TokenErrorReporterError
    | typeof VaiControllerErrorReporterError
    | typeof VaiVaultErrorReporterError
    | typeof XvsVaultProxyErrorReporterError,
  infoEnum:
    | typeof ComptrollerErrorReporterFailureInfo
    | typeof TokenErrorReporterFailureInfo
    | typeof VaiControllerErrorReporterFailureInfo
    | typeof VaiVaultErrorReporterInfo
    | typeof XvsVaultProxyErrorReporterInfo,
) => {
  if (receipt.events?.Failure) {
    const { error, info } = receipt.events?.Failure.returnValues;
    throw new VError({
      type: 'transaction',
      code: errorEnum[error] as VErrorPhraseMap['transaction'],
      data: {
        error: errorEnum[error] as VErrorPhraseMap['transaction'],
        info: infoEnum[info] as VErrorPhraseMap['transaction'],
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
    VaiControllerErrorReporterError,
    VaiControllerErrorReporterFailureInfo,
  );

export const checkForVaiVaultTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(receipt, VaiVaultErrorReporterError, VaiVaultErrorReporterInfo);

export const checkForXvsVaultProxyTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    XvsVaultProxyErrorReporterError,
    XvsVaultProxyErrorReporterInfo,
  );
