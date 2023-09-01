import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Asset, Pool, VToken } from 'types';
import {
  addUserPropsToPool,
  areAddressesEqual,
  calculateApy,
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertPriceMantissaToDollars,
  convertWeiToTokens,
  formatDistribution,
  getTokenByAddress,
  multiplyMantissaDaily,
} from 'utilities';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import MAX_UINT256 from 'constants/maxUint256';
import { TOKENS } from 'constants/tokens';
import { logError } from 'context/ErrorLogger';

const BSC_MAINNET_VCAN_MAIN_POOL_ADDRESS = '0xeBD0070237a0713E8D94fEf1B728d3d993d290ef';

export interface FormatToPoolInput {
  name: string;
  description: string;
  comptrollerContractAddress: string;
  vTokenMetadataResults: Awaited<
    ReturnType<ContractTypeByName<'venusLens'>['callStatic']['vTokenMetadataAll']>
  >;
  underlyingTokenPriceResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'resilientOracle'>['getPrice']>>
  >[];
  borrowCapsResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['borrowCaps']>>
  >[];
  supplyCapsResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['supplyCaps']>>
  >[];
  xvsBorrowSpeedResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['venusBorrowSpeeds']>>
  >[];
  xvsSupplySpeedResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['venusSupplySpeeds']>>
  >[];
  xvsBorrowStateResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['venusBorrowState']>>
  >[];
  xvsSupplyStateResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['venusSupplyState']>>
  >[];
  xvsPriceMantissa: BigNumber;
  userCollateralizedVTokenAddresses?: string[];
  userVTokenBalances?: Awaited<
    ReturnType<ContractTypeByName<'venusLens'>['callStatic']['vTokenBalancesAll']>
  >;
  userVaiBorrowBalanceWei?: BigNumber;
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
  xvsBorrowSpeedResults,
  xvsSupplySpeedResults,
  xvsBorrowStateResults,
  xvsSupplyStateResults,
  xvsPriceMantissa,
  userCollateralizedVTokenAddresses,
  userVTokenBalances,
  userVaiBorrowBalanceWei, // mainParticipantsCountResult,
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

    const xvsBorrowSpeedResult = xvsBorrowSpeedResults[index];
    const xvsBorrowSpeedMantissa =
      xvsBorrowSpeedResult.status === 'fulfilled'
        ? new BigNumber(xvsBorrowSpeedResult.value.toString())
        : undefined;

    if (!xvsBorrowSpeedMantissa) {
      logError(
        `XVS Borrow speed could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`,
      );
      return;
    }

    const xvsSupplySpeedResult = xvsSupplySpeedResults[index];
    const xvsSupplySpeedMantissa =
      xvsSupplySpeedResult.status === 'fulfilled'
        ? new BigNumber(xvsSupplySpeedResult.value.toString())
        : undefined;

    if (!xvsSupplySpeedMantissa) {
      logError(
        `XVS Supply speed could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`,
      );
      return;
    }

    const xvsBorrowStateResult = xvsBorrowStateResults[index];
    const xvsBorrowStateMantissa =
      xvsBorrowStateResult.status === 'fulfilled'
        ? new BigNumber(xvsBorrowStateResult.value.toString())
        : undefined;

    if (!xvsBorrowStateMantissa) {
      logError(
        `XVS Borrow state could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`,
      );
      return;
    }

    const xvsSupplyStateResult = xvsSupplyStateResults[index];
    const xvsSupplyStateMantissa =
      xvsSupplyStateResult.status === 'fulfilled'
        ? new BigNumber(xvsSupplyStateResult.value.toString())
        : undefined;

    if (!xvsSupplyStateMantissa) {
      logError(
        `XVS Supply state could not be fetched for vToken: ${vToken.symbol} ${vToken.address}`,
      );
      return;
    }

    const userVTokenBalancesResult = userVTokenBalances?.[index];

    const xvsPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: xvsPriceMantissa,
      token: TOKENS.xvs,
    });

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

    const exchangeRateMantissa = new BigNumber(vTokenMetaData.exchangeRateCurrent.toString());

    const exchangeRateVTokens = exchangeRateMantissa.isEqualTo(0)
      ? new BigNumber(0)
      : new BigNumber(1).div(
          exchangeRateMantissa.div(
            new BigNumber(10).pow(
              COMPOUND_DECIMALS + vToken.underlyingToken.decimals - vToken.decimals,
            ),
          ),
        );

    const supplyDailyPercentageRate = multiplyMantissaDaily({
      mantissa: new BigNumber(vTokenMetaData.supplyRatePerBlock.toString()),
    });

    const supplyApyPercentage = calculateApy({
      dailyRate: supplyDailyPercentageRate,
    });

    const borrowDailyPercentageRate = multiplyMantissaDaily({
      mantissa: new BigNumber(vTokenMetaData.borrowRatePerBlock.toString()),
    });

    const borrowApyPercentage = calculateApy({
      dailyRate: borrowDailyPercentageRate,
    });

    const supplyPercentageRatePerBlock = supplyDailyPercentageRate.dividedBy(BLOCKS_PER_DAY);
    const borrowPercentageRatePerBlock = borrowDailyPercentageRate.dividedBy(BLOCKS_PER_DAY);

    const supplyBalanceVTokens = convertWeiToTokens({
      valueWei: new BigNumber(vTokenMetaData.totalSupply.toString()),
      token: vToken,
    });
    const supplyBalanceTokens = supplyBalanceVTokens.div(exchangeRateVTokens);
    const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(tokenPriceDollars);
    const supplyBalanceCents = convertDollarsToCents(supplyBalanceDollars);

    const borrowBalanceTokens = convertWeiToTokens({
      valueWei: new BigNumber(vTokenMetaData.totalBorrows.toString()),
      token: vToken.underlyingToken,
    });
    const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(tokenPriceDollars);
    const borrowBalanceCents = convertDollarsToCents(borrowBalanceDollars);

    const borrowDailyDistributedXvs = multiplyMantissaDaily({
      mantissa: xvsBorrowSpeedMantissa,
      decimals: TOKENS.xvs.decimals,
    });

    const borrowXvsDistribution = formatDistribution({
      rewardToken: TOKENS.xvs,
      rewardTokenPriceDollars: xvsPriceDollars,
      dailyDistributedRewardTokens: borrowDailyDistributedXvs,
      balanceDollars: borrowBalanceDollars,
    });

    const supplyDailyDistributedXvs = multiplyMantissaDaily({
      mantissa: xvsSupplySpeedMantissa,
      decimals: TOKENS.xvs.decimals,
    });

    const supplyXvsDistribution = formatDistribution({
      rewardToken: TOKENS.xvs,
      rewardTokenPriceDollars: xvsPriceDollars,
      dailyDistributedRewardTokens: supplyDailyDistributedXvs,
      balanceDollars: supplyBalanceDollars,
    });

    const isCollateralOfUser = (userCollateralizedVTokenAddresses || []).includes(
      vTokenMetaData.vToken,
    );
    const userSupplyBalanceTokens = userVTokenBalancesResult?.balanceOfUnderlying
      ? convertWeiToTokens({
          valueWei: new BigNumber(userVTokenBalancesResult.balanceOfUnderlying.toString()),
          token: vToken.underlyingToken,
        })
      : new BigNumber(0);

    const userBorrowBalanceTokens = userVTokenBalancesResult?.balanceOfUnderlying
      ? convertWeiToTokens({
          valueWei: new BigNumber(userVTokenBalancesResult.borrowBalanceCurrent.toString()),
          token: vToken.underlyingToken,
        })
      : new BigNumber(0);

    const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(tokenPriceCents);
    const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(tokenPriceCents);

    const userWalletBalanceTokens = userVTokenBalancesResult?.tokenBalance
      ? convertWeiToTokens({
          valueWei: new BigNumber(userVTokenBalancesResult.tokenBalance.toString()),
          token: vToken.underlyingToken,
        })
      : new BigNumber(0);
    const userWalletBalanceCents = userWalletBalanceTokens.multipliedBy(tokenPriceCents);

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
      exchangeRateVTokens,
      borrowApyPercentage,
      supplyApyPercentage,
      supplyPercentageRatePerBlock,
      borrowPercentageRatePerBlock,
      supplyBalanceTokens,
      supplyBalanceCents,
      borrowBalanceTokens,
      borrowBalanceCents,
      supplyDistributions: [supplyXvsDistribution],
      borrowDistributions: [borrowXvsDistribution],
      supplierCount: 0, // TODO: fetch
      borrowerCount: 0, // TODO: fetch
      // User-specific props
      userSupplyBalanceTokens,
      userSupplyBalanceCents,
      userBorrowBalanceTokens,
      userBorrowBalanceCents,
      userWalletBalanceTokens,
      userWalletBalanceCents,
      // This will be calculated after all assets have been formatted
      userPercentOfLimit: 0,
      isCollateralOfUser,
    };

    assets.push(asset);
  });

  const pool: Pool = addUserPropsToPool({
    name,
    description,
    comptrollerAddress: comptrollerContractAddress,
    isIsolated: false,
    assets,
  });

  // Add user VAI loan to user borrow balance
  if (pool.userBorrowBalanceCents && userVaiBorrowBalanceWei) {
    const userVaiBorrowBalanceCents = convertWeiToTokens({
      valueWei: userVaiBorrowBalanceWei,
      token: TOKENS.vai,
    }) // Convert VAI to dollar cents (we assume 1 VAI = 1 dollar)
      .times(100);

    pool.userBorrowBalanceCents.plus(userVaiBorrowBalanceCents);
  }

  // Calculate userPercentOfLimit for each asset
  const formattedAssets: Asset[] = assets.map(asset => ({
    ...asset,
    userPercentOfLimit:
      asset.userBorrowBalanceCents?.isGreaterThan(0) && pool.userBorrowLimitCents?.isGreaterThan(0)
        ? new BigNumber(asset.userBorrowBalanceCents)
            .times(100)
            .div(pool.userBorrowLimitCents)
            .dp(2)
            .toNumber()
        : 0,
  }));

  return {
    ...pool,
    assets: formattedAssets,
  };
};

export default formatToPool;
