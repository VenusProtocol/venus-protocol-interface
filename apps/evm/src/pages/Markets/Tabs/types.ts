import type { To } from 'react-router';
import type { EModeAssetSettings, EModeGroup, Token } from 'types';

export interface ExtendedEModeAssetSettings extends EModeAssetSettings {
  isPaused: boolean;
}

export interface BlockingBorrowPosition {
  token: Token;
  userBorrowBalanceTokens: BigNumber;
  userBorrowBalanceCents: number;
  to: To;
}

export interface ExtendedEModeGroup extends Omit<EModeGroup, 'assetSettings'> {
  userBlockingBorrowPositions: BlockingBorrowPosition[];
  userHasEnoughCollateral: boolean;
  hypotheticalUserHealthFactor: number;
  assetSettings: ExtendedEModeAssetSettings[];
}
