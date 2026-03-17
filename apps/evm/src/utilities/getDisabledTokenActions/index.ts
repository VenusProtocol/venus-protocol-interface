import { getDisabledTokenActions as getLocalDisabledTokenActions } from 'libs/tokens';
import type { ChainId, TokenAction } from 'types';
import removeDuplicates from 'utilities/removeDuplicates';

export enum ContractVTokenAction {
  MINT = 'MINT',
  REDEEM = 'REDEEM',
  BORROW = 'BORROW',
  REPAY = 'REPAY',
  SEIZE = 'SEIZE',
  LIQUIDATE = 'LIQUIDATE',
  TRANSFER = 'TRANSFER',
  ENTER_MARKET = 'ENTER_MARKET',
  EXIT_MARKET = 'EXIT_MARKET',
}

export interface GetDisabledTokenActions {
  chainId: ChainId;
  tokenAddresses: string[];
  bitmask: number;
}

export const getDisabledTokenActions = ({
  bitmask,
  chainId,
  tokenAddresses,
}: GetDisabledTokenActions) => {
  // Transform bitmask from a number to its binary representation
  // eslint-disable-next-line no-bitwise
  const formattedBitmask = (bitmask >>> 0).toString(2);

  // Bits are counted from right to left, so we first reverse the bitmask order then map each bit
  // using the ContractTokenAction enum. A bit value of 1 indicates a paused action (and so 0
  // indicates the action is not paused)
  const pausedTokenActions = [...formattedBitmask.split('')]
    .reverse()
    .reduce<TokenAction[]>((acc, bit, index) => {
      if (bit === '0') {
        return acc;
      }

      const pausedAction = Object.values(ContractVTokenAction)[index];

      // Translate paused vToken action from contract into disabled action
      const translatedDisabledActions: TokenAction[] = [];

      if (pausedAction === ContractVTokenAction.MINT) {
        translatedDisabledActions.push('supply', 'swapAndSupply');
      } else if (pausedAction === ContractVTokenAction.REDEEM) {
        translatedDisabledActions.push('withdraw');
      } else if (pausedAction === ContractVTokenAction.BORROW) {
        translatedDisabledActions.push('borrow', 'boost');
      } else if (pausedAction === ContractVTokenAction.REPAY) {
        translatedDisabledActions.push('repay', 'swapAndRepay');
      } else if (pausedAction === ContractVTokenAction.ENTER_MARKET) {
        translatedDisabledActions.push('enterMarket');
      } else if (pausedAction === ContractVTokenAction.EXIT_MARKET) {
        translatedDisabledActions.push('exitMarket');
      }

      return [...acc, ...translatedDisabledActions];
    }, []);

  // Merge disabled actions from contract with local disabled actions
  const localDisabledTokenActions = tokenAddresses.flatMap(tokenAddress =>
    getLocalDisabledTokenActions({
      chainId,
      tokenAddress,
    }),
  );

  const disabledTokenActions: TokenAction[] = removeDuplicates([
    ...pausedTokenActions,
    ...localDisabledTokenActions,
  ]);
  return disabledTokenActions;
};
