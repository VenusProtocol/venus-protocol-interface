const switchChain = vi.fn(({ callback }: { callback: () => void }) => callback());

export const useSwitchChain = vi.fn(() => ({
  switchChain,
}));
