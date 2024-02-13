import tokens from '__mocks__/models/tokens';

export * from 'libs/tokens/hooks/useGetToken';
export * from 'libs/tokens/hooks/useGetTokens';
export * from 'libs/tokens/hooks/useGetSwapTokens';
export * from 'libs/tokens/infos';

export const getTokens = vi.fn(() => tokens);
export const getSwapTokens = vi.fn(() => tokens);
export const isTokenActionEnabled = vi.fn(() => true);
