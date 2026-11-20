const listeners: (() => void)[] = [];
let isSystemDark = false;

const loadStore = async () => {
  vi.resetModules();
  return import('../store');
};

describe('useTheme store', () => {
  beforeEach(() => {
    listeners.length = 0;
    isSystemDark = false;
    localStorage.clear();
    delete document.documentElement.dataset.theme;

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        get matches() {
          return isSystemDark;
        },
        addEventListener: (_event: string, listener: () => void) => listeners.push(listener),
      }),
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'matchMedia');
  });

  const switchSystemTheme = (isDark: boolean) => {
    isSystemDark = isDark;
    for (const listener of listeners) {
      listener();
    }
  };

  it('follows the system theme by default', async () => {
    isSystemDark = true;
    const { useStore } = await loadStore();

    expect(useStore.getState().preference).toBe('system');
    expect(useStore.getState().theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('switches live when the system theme changes while system is picked', async () => {
    const { useStore } = await loadStore();
    useStore.getState().setPreference('system');

    switchSystemTheme(true);

    expect(useStore.getState().theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');

    switchSystemTheme(false);

    expect(useStore.getState().theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('ignores system changes when dark or light is picked', async () => {
    const { useStore } = await loadStore();
    useStore.getState().setPreference('light');

    switchSystemTheme(true);

    expect(useStore.getState().preference).toBe('light');
    expect(useStore.getState().theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('keeps a saved dark or light choice', async () => {
    isSystemDark = true;
    localStorage.setItem('venus-theme', JSON.stringify({ state: { theme: 'light' }, version: 0 }));
    const { useStore } = await loadStore();

    expect(useStore.getState().preference).toBe('light');
    expect(useStore.getState().theme).toBe('light');
  });

  it('falls back to system when the saved value is unknown', async () => {
    isSystemDark = true;
    localStorage.setItem('venus-theme', JSON.stringify({ state: { theme: 'blue' }, version: 0 }));
    const { useStore } = await loadStore();

    expect(useStore.getState().preference).toBe('system');
    expect(useStore.getState().theme).toBe('dark');
  });

  it('saves the picked option under the existing key and field', async () => {
    const { useStore } = await loadStore();
    useStore.getState().setPreference('system');

    expect(JSON.parse(localStorage.getItem('venus-theme') || 'null')).toEqual({
      state: { theme: 'system' },
      version: 0,
    });
  });
});
