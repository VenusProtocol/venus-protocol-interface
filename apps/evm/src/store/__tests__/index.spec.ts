import {
  DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
  MAXIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE,
} from 'constants/swap';
import { ChainId } from 'types';
import { extractEnumValues } from 'utilities/extractEnumValues';
import { initialUserSettings, store } from '..';

const allChainIds = extractEnumValues(ChainId);

describe('store', () => {
  describe('userSettings', () => {
    it('sets correct initial user settings', () => {
      expect(store.getState().userSettings).toEqual(initialUserSettings);
    });
  });

  describe('setUserSettings', () => {
    it('updates user settings correctly', () => {
      store.getState().setUserSettings({
        settings: {
          gaslessTransactions: false,
        },
      });

      expect(store.getState().userSettings).toEqual(
        allChainIds.reduce(
          (acc, chainId) => ({
            ...acc,
            [chainId]: {
              ...initialUserSettings[chainId],
              gaslessTransactions: false,
            },
          }),
          {},
        ),
      );
    });

    it('updates user settings correctly when passing chainIds', () => {
      store.getState().setUserSettings({
        settings: {
          gaslessTransactions: false,
          doNotShowImportPositionsModal: true,
        },
        chainIds: [ChainId.BSC_TESTNET, ChainId.ARBITRUM_SEPOLIA],
      });

      expect(store.getState().userSettings).toEqual({
        ...initialUserSettings,
        [ChainId.BSC_TESTNET]: {
          gaslessTransactions: false,
          doNotShowImportPositionsModal: true,
        },
        [ChainId.ARBITRUM_SEPOLIA]: {
          gaslessTransactions: false,
          doNotShowImportPositionsModal: true,
        },
      });
    });
  });

  describe('persist merge', () => {
    it('clamps persisted slippage tolerance above the maximum', () => {
      const merge = store.persist.getOptions().merge;

      const mergedState = merge?.(
        {
          userSettings: {
            [ChainId.BSC_TESTNET]: {
              slippageTolerancePercentage: String(MAXIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE + 1),
            },
            [ChainId.ZKSYNC_MAINNET]: {
              gaslessTransactions: false,
              slippageTolerancePercentage: String(MAXIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE),
            },
          },
          setUserSettings: store.getState().setUserSettings,
        },
        store.getInitialState(),
      );

      expect(mergedState?.userSettings[ChainId.BSC_TESTNET]).toEqual({
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
      });
      expect(mergedState?.userSettings[ChainId.ZKSYNC_MAINNET]).toEqual({
        gaslessTransactions: false,
        slippageTolerancePercentage: String(MAXIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE),
      });
    });
  });
});
