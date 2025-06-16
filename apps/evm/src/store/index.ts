import createDeepMerge from '@fastify/deepmerge';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ChainId } from 'types';
import { createStoreSelectors, extractEnumValues } from 'utilities';

export interface UserChainSettings {
  gaslessTransactions: boolean;
  doNotShowImportPositionsModal: boolean;
}

type UserSettings = Partial<Record<ChainId, Partial<UserChainSettings>>>;

export interface State {
  userSettings: UserSettings;
  setUserSettings: (input: {
    settings: Partial<UserChainSettings>;
    chainIds?: ChainId[];
  }) => void;
}

const deepMerge = createDeepMerge({ all: true });

const allChainIds = extractEnumValues(ChainId);
export const initialUserSettings: UserSettings = {
  [ChainId.ZKSYNC_MAINNET]: {
    gaslessTransactions: true,
  },
  [ChainId.ZKSYNC_SEPOLIA]: {
    gaslessTransactions: true,
  },
};

const useStore = create<State>()(
  persist(
    set => ({
      userSettings: initialUserSettings,
      setUserSettings: ({ settings, chainIds = allChainIds }) =>
        set(state => ({
          ...state,
          userSettings: {
            ...state.userSettings,
            ...chainIds.reduce<Partial<UserChainSettings>>(
              (acc, chainId) => ({
                ...acc,
                [chainId]: {
                  ...state.userSettings[chainId],
                  ...settings,
                },
              }),
              {},
            ),
          },
        })),
    }),
    {
      name: 'venus-global-store',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
);

export const store = createStoreSelectors(useStore);
