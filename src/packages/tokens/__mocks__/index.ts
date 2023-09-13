import tokens, { vai, vrt, xvs } from '__mocks__/models/tokens';

export * from '../tokenInfos';
export const getVenusTokens = vi.fn(() => [xvs, vrt, vai]);
export const getTokens = vi.fn(() => tokens);
export const getPancakeSwapTokens = vi.fn(() => tokens);
export const isTokenActionEnabled = vi.fn(() => true);
