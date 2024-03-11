import type { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createStoreSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};

  Object.keys(store.getState()).forEach(k => {
    (store.use as any)[k] = () => store(s => s[k as keyof typeof s]);
  });

  return store;
};
