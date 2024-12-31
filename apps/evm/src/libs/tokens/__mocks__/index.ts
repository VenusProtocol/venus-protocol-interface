import tokens from '__mocks__/models/tokens';
import type { ChainId } from 'types';
import { vTokenAssetsPerChainId } from '../infos/vTokens';

export * from 'libs/tokens/infos';

export const useGetToken = vi.fn(({ symbol }) => tokens.find(token => token.symbol === symbol));

export const useGetTokens = vi.fn(() => tokens);
export const getTokens = vi.fn(() => tokens);

export const getVTokenAsset = vi.fn(
  ({ vTokenAddress, chainId }: { vTokenAddress: string; chainId: ChainId }) =>
    vTokenAssetsPerChainId[chainId][vTokenAddress.toLowerCase()],
);

export const useGetSwapTokens = vi.fn(() => tokens);
export const getSwapTokens = vi.fn(() => tokens);

export const getDisabledTokenActions = vi.fn(() => []);
