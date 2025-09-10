import type { ChainId } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';

import type { ApiMarket } from 'clients/api/queries/useGetPools/getPools/getApiPools';
import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import { getVTokenAsset } from 'libs/tokens';
import type { EModeAssetSettings, EModeGroup, Token, VToken } from 'types';
import {
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPercentageFromSmartContract,
  findTokenByAddress,
} from 'utilities';

// This function is only used to facilitate the development work of the E-mode feature. It will be
// removed once actual E-mode groups are returned by the API
export const generateFakeEModeGroup = ({
  apiMarkets,
  tokens,
  chainId,
  id,
  name,
  description,
}: {
  apiMarkets: ApiMarket[];
  tokens: Token[];
  chainId: ChainId;
  id: number;
  name: string;
  description: string;
}) => {
  const group: EModeGroup = {
    id,
    name,
    description,
    assetSettings: apiMarkets.reduce<EModeAssetSettings[]>((acc, market, i) => {
      const underlyingToken = findTokenByAddress({
        tokens,
        address: market.underlyingAddress || NATIVE_TOKEN_ADDRESS,
      });

      if (!underlyingToken) {
        return acc;
      }

      // Shape vToken
      const vToken: VToken = {
        address: market.address,
        asset: getVTokenAsset({ vTokenAddress: market.address, chainId }),
        decimals: 8,
        symbol: `v${underlyingToken.symbol}`,
        underlyingToken,
      };

      const liquidityTokens = convertMantissaToTokens({
        value: new BigNumber(market.cashMantissa),
        token: vToken.underlyingToken,
      });

      const liquidationThresholdPercentage = convertPercentageFromSmartContract(
        market.liquidationThresholdMantissa,
      );

      const assetSettings: EModeAssetSettings = {
        vToken,
        collateralFactor:
          i > 3
            ? 0
            : convertFactorFromSmartContract({
                factor: new BigNumber(market.collateralFactorMantissa),
              }) + 0.1,
        liquidationThresholdPercentage: liquidationThresholdPercentage + 12,
        liquidationPenaltyPercentage: liquidationThresholdPercentage - 50,
        liquidityCents: liquidityTokens.multipliedBy(100).toNumber(),
        liquidityTokens,
        isBorrowable:
          underlyingToken.symbol !== 'XVS' &&
          underlyingToken.symbol !== 'BTCB' &&
          underlyingToken.symbol !== 'BUSD',
      };

      return [...acc, assetSettings];
    }, []),
  };

  return group;
};
