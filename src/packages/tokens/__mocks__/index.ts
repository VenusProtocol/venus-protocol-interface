import tokens from '__mocks__/models/tokens';

export * from 'packages/tokens/hooks/useGetToken';
export * from 'packages/tokens/hooks/useGetTokens';
export * from 'packages/tokens/hooks/useGetSwapTokens';
export * from 'packages/tokens/tokenInfos';

export const getTokens = vi.fn(() => tokens);
export const getSwapTokens = vi.fn(() => tokens);
export const isTokenActionEnabled = vi.fn(() => true);
