import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Asset, Pool, VToken } from 'types';
import {
  areAddressesEqual,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertPriceMantissaToDollars,
  convertWeiToTokens,
  getTokenByAddress,
} from 'utilities';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import MAX_UINT256 from 'constants/maxUint256';
import { logError } from 'context/ErrorLogger';

const BSC_MAINNET_VCAN_MAIN_POOL_ADDRESS = '0xeBD0070237a0713E8D94fEf1B728d3d993d290ef';

export interface FormatToPoolInput {
  name: string;
  description: string;
  comptrollerContractAddress: string;
  vTokenMetadataResults: Awaited<
    ReturnType<ContractTypeByName<'venusLens'>['callStatic']['vTokenMetadataAll']>
  >;
  currentBlockNumber: number;
  underlyingTokenPriceResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'resilientOracle'>['getPrice']>>
  >[];
  borrowCapsResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['borrowCaps']>>
  >[];
  supplyCapsResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['supplyCaps']>>
  >[];
  xvsPriceMantissa: BigNumber;
  assetsInResult?: string[];
  userVTokenBalancesResults?: Awaited<
    ReturnType<ContractTypeByName<'venusLens'>['callStatic']['vTokenBalancesAll']>
  >;
  vaiRepayAmountResult?: BigNumber;
  mainParticipantsCountResult?: Awaited<ReturnType<typeof getIsolatedPoolParticipantsCount>>;
}

const formatToPool = ({
  name,
  description,
  comptrollerContractAddress,
  vTokenMetadataResults,
  underlyingTokenPriceResults,
  borrowCapsResults,
  supplyCapsResults,
  xvsPriceMantissa,
  currentBlockNumber,
  assetsInResult,
  userVTokenBalancesResults,
  vaiRepayAmountResult,
  mainParticipantsCountResult,
}: FormatToPoolInput) => {
  const assets: Asset[] = [];

  vTokenMetadataResults.forEach((vTokenMetaData, index) => {
    // Temporary workaround to filter out vCAN
    if (areAddressesEqual(vTokenMetaData.vToken, BSC_MAINNET_VCAN_MAIN_POOL_ADDRESS)) {
      // TODO: remove once a more generic solution has been integrated on the contract side
      return;
    }

    const underlyingToken = getTokenByAddress(vTokenMetaData.underlyingAssetAddress);

    if (!underlyingToken) {
      logError(`Record missing for token: ${vTokenMetaData.underlyingAssetAddress}`);
      return;
    }

    const vToken: VToken = {
      decimals: 8,
      address: vTokenMetaData.vToken,
      symbol: `v${underlyingToken.symbol}`,
      underlyingToken,
    };

    const underlyingTokenPriceResult = underlyingTokenPriceResults[index];

    const underlyingTokenPriceMantissa =
      underlyingTokenPriceResult.status === 'fulfilled'
        ? new BigNumber(underlyingTokenPriceResult.value.toString())
        : undefined;

    if (!underlyingTokenPriceMantissa) {
      logError(
        `Price could not be fetched for token: ${underlyingToken.symbol} ${underlyingToken.address}`,
      );
      return;
    }

    const borrowCapsResult = borrowCapsResults[index];
    const borrowCapsMantissa =
      borrowCapsResult.status === 'fulfilled'
        ? new BigNumber(borrowCapsResult.value.toString())
        : undefined;

    if (!borrowCapsMantissa) {
      logError(`Borrow cap could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`);
      return;
    }

    const supplyCapsResult = supplyCapsResults[index];
    const supplyCapsMantissa =
      supplyCapsResult.status === 'fulfilled'
        ? new BigNumber(supplyCapsResult.value.toString())
        : undefined;

    if (!supplyCapsMantissa) {
      logError(`Supply cap could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`);
      return;
    }

    const tokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: underlyingTokenPriceMantissa,
      token: underlyingToken,
    });

    const tokenPriceCents = convertDollarsToCents(tokenPriceDollars);

    const unformattedBorrowCapTokens = convertWeiToTokens({
      valueWei: borrowCapsMantissa,
      token: vToken.underlyingToken,
    });

    const borrowCapTokens = unformattedBorrowCapTokens.isEqualTo(0)
      ? undefined
      : unformattedBorrowCapTokens;

    const unformattedSupplyCapTokens = convertWeiToTokens({
      valueWei: supplyCapsMantissa,
      token: vToken.underlyingToken,
    });

    const supplyCapTokens = unformattedSupplyCapTokens
      .multipliedBy(COMPOUND_MANTISSA)
      .isEqualTo(MAX_UINT256)
      ? undefined
      : unformattedSupplyCapTokens;

    const reserveFactor = convertFactorFromSmartContract({
      factor: new BigNumber(vTokenMetaData.reserveFactorMantissa.toString()),
    });

    const collateralFactor = convertFactorFromSmartContract({
      factor: new BigNumber(vTokenMetaData.collateralFactorMantissa.toString()),
    });

    const cashTokens = convertWeiToTokens({
      valueWei: new BigNumber(vTokenMetaData.totalCash.toString()),
      token: vToken.underlyingToken,
    });

    const liquidityCents = cashTokens.multipliedBy(tokenPriceCents);

    const reserveTokens = convertWeiToTokens({
      valueWei: new BigNumber(vTokenMetaData.totalReserves.toString()),
      token: vToken.underlyingToken,
    });

    const asset: Asset = {
      vToken,
      tokenPriceCents,
      reserveFactor,
      collateralFactor,
      liquidityCents,
      reserveTokens,
      cashTokens,
      borrowCapTokens,
      supplyCapTokens,

      exchangeRateVTokens: new BigNumber(0),
      supplierCount: 0,
      borrowerCount: 0,
      borrowApyPercentage: new BigNumber(0),
      supplyApyPercentage: new BigNumber(0),
      supplyBalanceTokens: new BigNumber(0),
      supplyBalanceCents: new BigNumber(0),
      borrowBalanceTokens: new BigNumber(0),
      borrowBalanceCents: new BigNumber(0),
      supplyPercentageRatePerBlock: new BigNumber(0),
      borrowPercentageRatePerBlock: new BigNumber(0),
      supplyDistributions: [],
      borrowDistributions: [],
      // User-specific props
      userSupplyBalanceTokens: new BigNumber(0),
      userSupplyBalanceCents: new BigNumber(0),
      userBorrowBalanceTokens: new BigNumber(0),
      userBorrowBalanceCents: new BigNumber(0),
      userWalletBalanceTokens: new BigNumber(0),
      userWalletBalanceCents: new BigNumber(0),
      userPercentOfLimit: 0,
      isCollateralOfUser: false,
    };

    assets.push(asset);
  });

  const pool: Pool = {
    comptrollerAddress: comptrollerContractAddress,
    name,
    description,
    isIsolated: false,
    assets,
  };

  return pool;
};

export default formatToPool;
