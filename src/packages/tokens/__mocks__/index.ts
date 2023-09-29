import tokens from '__mocks__/models/tokens';

export * from 'packages/tokens/hooks/useGetToken';
export * from 'packages/tokens/hooks/useGetTokens';
export * from 'packages/tokens/tokenInfos';

export const getPancakeSwapTokens = vi.fn(() => tokens);
export const isTokenActionEnabled = vi.fn(() => true);
export const getTokens = vi.fn(() => tokens);
