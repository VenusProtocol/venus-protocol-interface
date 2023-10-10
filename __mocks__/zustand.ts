import { act } from '@testing-library/react';
import * as zustand from 'zustand';

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof zustand>('zustand');

// A variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

// When creating a store, we get its initial state, create a reset function and add it in the set
export const create = (<T>() =>
  (stateCreator: zustand.StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    const initialState = store.getState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });

    return store;
  }) as typeof zustand.create;

// When creating a store, we get its initial state, create a reset function and add it in the set
export const createStore = (<T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
}) as typeof zustand.createStore;

// Reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResetFns.forEach(resetFn => {
      resetFn();
    });
  });
});
