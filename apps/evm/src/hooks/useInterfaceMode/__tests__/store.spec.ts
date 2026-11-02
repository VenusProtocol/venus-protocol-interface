import { useStore } from '../store';

const STORAGE_KEY = 'venus-interface-mode';

const rehydrateAt = async (hash: string) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { mode: 'lite' }, version: 0 }));
  window.location.hash = hash;
  await useStore.persist.rehydrate();

  return useStore.getState().mode;
};

describe('useInterfaceMode store', () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.hash = '';
  });

  it('keeps the saved mode on the home page', async () => {
    expect(await rehydrateAt('#/')).toBe('lite');
  });

  it('keeps the saved mode on the dashboard, which both modes share', async () => {
    expect(await rehydrateAt('#/dashboard?chainId=97')).toBe('lite');
  });

  it('switches to Pro when entering through a Pro page', async () => {
    expect(await rehydrateAt('#/markets')).toBe('pro');
  });
});
