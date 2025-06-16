import createDeepMerge from '@fastify/deepmerge';
import { ChainId } from 'types';
import { createStoreSelectors, extractEnumValues } from 'utilities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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
    immer(set => ({
      userSettings: initialUserSettings,
      setUserSettings: ({ settings, chainIds = allChainIds }) =>
        set(state =>
          chainIds.forEach(chainId =>
            Object.entries(settings).forEach(([key, value]) => {
              if (!state.userSettings[chainId]) {
                state.userSettings[chainId] = {};
              }

              state.userSettings[chainId][key as keyof UserChainSettings] = value;
            }),
          ),
        ),
    })),
    {
      name: 'venus-global-store',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
);

export const store = createStoreSelectors(useStore);
