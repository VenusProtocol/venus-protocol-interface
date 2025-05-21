import BigNumber from 'bignumber.js';

import {
  erc20Abi,
  isolatedPoolComptrollerAbi,
  vaiControllerAbi,
  vaiVaultAbi,
  xvsVaultAbi,
} from 'libs/contracts';
import { type Abi, type TransactionReceipt, parseEventLogs } from 'viem';
import { VError, type VErrorPhraseMap } from './VError';
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
} from './contractErrors';

// Some contracts don't revert when failing but instead return a Failure event.
// These functions are used to detect such cases and throw an error when a
// Failure event is detected

type EventErrorArg = { _hex: string };

const checkForTransactionError = (
  receipt: TransactionReceipt,
  abi: Abi,
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
  const events = parseEventLogs({
    abi,
    logs: receipt.logs,
  });

  const failureEvent = events.find(event => event.eventName === 'Failure');

  if (failureEvent) {
    const errorIndex =
      'error' in failureEvent.args && '_hex' in (failureEvent.args.error as EventErrorArg)
        ? new BigNumber((failureEvent.args.error as EventErrorArg)._hex).toNumber()
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

export const checkForComptrollerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    isolatedPoolComptrollerAbi,
    ComptrollerErrorReporterError,
    ComptrollerErrorReporterFailureInfo,
  );

export const checkForTokenTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    erc20Abi,
    TokenErrorReporterError,
    TokenErrorReporterFailureInfo,
  );

export const checkForVaiControllerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    vaiControllerAbi,
    VaiControllerErrorReporterError,
    VaiControllerErrorReporterFailureInfo,
  );

export const checkForVaiVaultTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    vaiVaultAbi,
    VaiVaultErrorReporterError,
    VaiVaultErrorReporterInfo,
  );

export const checkForXvsVaultProxyTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    xvsVaultAbi,
    XvsVaultProxyErrorReporterError,
    XvsVaultProxyErrorReporterInfo,
  );
