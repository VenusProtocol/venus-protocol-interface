import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ChainId } from 'types';
import { createStoreSelectors, extractEnumValues } from 'utilities';

// TODO: add tests

interface UserChainSettings {
  enableGaslessTransactions: boolean;
}

export interface State {
  userSettings: Record<ChainId, UserChainSettings>;
  setUserSettings: (input: {
    settings: Partial<UserChainSettings>;
    chainIds?: ChainId[];
  }) => void;
}

const allChainIds = extractEnumValues(ChainId);
const initialUserSettings = allChainIds.reduce(
  (acc, chainId) => ({
    ...acc,
    [chainId]: {
      enableGaslessTransactions: true,
    },
  }),
  {} as Record<ChainId, UserChainSettings>,
);

const useStore = create<State>()(
  persist(
    set => ({
      userSettings: initialUserSettings,
      setUserSettings: ({ settings, chainIds = allChainIds }) =>
        set(state => {
          const newUserSettings = chainIds.reduce<Partial<UserChainSettings>>(
            (acc, chainId) => ({
              ...acc,
              [chainId]: {
                ...settings,
              },
            }),
            {},
          );

          return {
            ...state,
            userSettings: {
              ...state.userSettings,
              ...newUserSettings,
            },
          };
        }),
    }),
    {
      name: 'venus-global-store',
    },
  ),
);

export const store = createStoreSelectors(useStore);
