import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';

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

// Some contracts don't revert when failing but instead return a Failure event.
// These functions are used to detect such cases and throw an error when a
// Failure event is detected

const checkForTransactionError = (
  receipt: ContractReceipt,
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
  const failureEvent = receipt.events?.find(event => event.event === 'Failure');

  if (failureEvent) {
    const errorIndex = failureEvent.args?.error
      ? // eslint-disable-next-line no-underscore-dangle
        new BigNumber(failureEvent.args.error._hex).toNumber()
      : 0;

    throw new VError({
      type: 'transaction',
      code: errorEnum[errorIndex] as VErrorPhraseMap['transaction'],
      data: {
        error: errorEnum[errorIndex] as VErrorPhraseMap['transaction'],
        info: infoEnum[errorIndex] as VErrorPhraseMap['transaction'],
      },
    });
  }
  return receipt;
};

export const checkForComptrollerTransactionError = (receipt: ContractReceipt) =>
  checkForTransactionError(
    receipt,
    ComptrollerErrorReporterError,
    ComptrollerErrorReporterFailureInfo,
  );

export const checkForTokenTransactionError = (receipt: ContractReceipt) =>
  checkForTransactionError(receipt, TokenErrorReporterError, TokenErrorReporterFailureInfo);

export const checkForVaiControllerTransactionError = (receipt: ContractReceipt) =>
  checkForTransactionError(
    receipt,
    VaiControllerErrorReporterError,
    VaiControllerErrorReporterFailureInfo,
  );

export const checkForVaiVaultTransactionError = (receipt: ContractReceipt) =>
  checkForTransactionError(receipt, VaiVaultErrorReporterError, VaiVaultErrorReporterInfo);

export const checkForXvsVaultProxyTransactionError = (receipt: ContractReceipt) =>
  checkForTransactionError(
    receipt,
    XvsVaultProxyErrorReporterError,
    XvsVaultProxyErrorReporterInfo,
  );
