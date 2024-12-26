import tokens from '__mocks__/models/tokens';

export * from 'libs/tokens/infos';

export const useGetToken = vi.fn(({ symbol }) => tokens.find(token => token.symbol === symbol));

export const useGetTokens = vi.fn(() => tokens);

export const useGetSwapTokens = vi.fn(() => tokens);
export const getSwapTokens = vi.fn(() => tokens);

export const getDisabledTokenActions = vi.fn(() => []);
