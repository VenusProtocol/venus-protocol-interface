import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { z } from 'zod';

import {
  useGetPools,
  useGetPrimeEstimation,
  useGetPrimeStatus,
  useGetTokenUsdPrice,
  useGetXvsVaultUserInfo,
} from 'clients/api';
import {
  Card,
  Delimiter,
  LabeledInlineContent,
  Select,
  type SelectOption,
  Spinner,
  TokenIconWithSymbol,
} from 'components';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset } from 'types';
import {
  areAddressesEqual,
  convertDollarsToCents,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import TEST_IDS from '../testIds';
import { Field } from './Field';
import { RewardDetails } from './RewardDetails';
import { validateNumericString } from './validateNumericString';

export const QUERY_PARAM_TOKEN_ADDRESS = 'tokenAddress';

export const Form: React.FC = () => {
  const { t } = useTranslation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const { accountAddress } = useAccountAddress();

  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const { data: getPrimeStatusData, isLoading: isGetPrimeStatusLoading } = useGetPrimeStatus({
    accountAddress,
  });
  const [
    primeMinimumStakedXvsMantissa,
    primeMaximumStakedXvsMantissa,
    primeMinimumStakedXvsTokens,
    primeMaximumStakedXvsTokens,
  ] = useMemo(
    () => [
      getPrimeStatusData?.primeMinimumStakedXvsMantissa || new BigNumber(0),
      getPrimeStatusData?.primeMaximumStakedXvsMantissa || new BigNumber(0),
      convertMantissaToTokens({
        value: getPrimeStatusData?.primeMinimumStakedXvsMantissa || new BigNumber('0'),
        token: xvs,
      }),
      convertMantissaToTokens({
        value: getPrimeStatusData?.primeMaximumStakedXvsMantissa || new BigNumber('0'),
        token: xvs,
      }),
    ],
    [getPrimeStatusData, xvs],
  );

  const xvsVaultPoolIndex = getPrimeStatusData?.xvsVaultPoolId;
  const { data: getXvsVaultUserInfoData } = useGetXvsVaultUserInfo(
    {
      poolIndex: xvsVaultPoolIndex || 0,
      rewardTokenAddress: xvs?.address || NULL_ADDRESS,
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress && !!xvs && typeof xvsVaultPoolIndex === 'number',
      refetchOnWindowFocus: false,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

  const userStakedXvsMantissa = useMemo(
    () =>
      getXvsVaultUserInfoData?.stakedAmountMantissa.minus(
        getXvsVaultUserInfoData.pendingWithdrawalsTotalAmountMantissa,
      ),
    [getXvsVaultUserInfoData],
  );

  const userStakedXvsTokens = useMemo(
    () =>
      userStakedXvsMantissa &&
      convertMantissaToTokens({
        value: userStakedXvsMantissa,
        token: xvs,
      }),
    [userStakedXvsMantissa, xvs],
  );

  const [searchParams, setSearchParams] = useSearchParams();

  // Extract assets affected by Prime
  const primeAssets = useMemo(() => {
    const acc: Asset[] = [];

    (getPoolsData?.pools || []).forEach(pool => {
      pool.assets.forEach(asset => {
        const distributions = asset.borrowTokenDistributions.concat(asset.supplyTokenDistributions);
        const hasPrimeDistribution = distributions.some(
          distribution => distribution.type === 'prime' || distribution.type === 'primeSimulation',
        );

        if (hasPrimeDistribution) {
          acc.push(asset);
        }
      });
    });

    return acc;
  }, [getPoolsData?.pools]);

  // Generate options from tokens affected by Prime
  const options = useMemo(() => {
    const selectOptions: SelectOption[] = primeAssets.map(primeToken => ({
      label: () => <TokenIconWithSymbol token={primeToken.vToken.underlyingToken} />,
      value: primeToken.vToken.address,
    }));

    return selectOptions;
  }, [primeAssets]);

  const defaultTokenAddress = options[0]?.value as string | undefined;

  const urlTokenAddress = searchParams.get(QUERY_PARAM_TOKEN_ADDRESS);
  const selectedAsset = useMemo(
    () =>
      urlTokenAddress
        ? primeAssets.find(token => areAddressesEqual(token.vToken.address, urlTokenAddress))
        : undefined,
    [urlTokenAddress, primeAssets],
  );

  const updateUrlTokenAddress = useCallback(
    ({ tokenAddress }: { tokenAddress: string }) => {
      setSearchParams(
        {
          ...Object.fromEntries(searchParams),
          [QUERY_PARAM_TOKEN_ADDRESS]: tokenAddress,
        },
        {
          replace: true,
        },
      );
    },
    [setSearchParams, searchParams],
  );

  // Initialize URL token address
  useEffect(() => {
    const isUrlTokenAddressValid =
      urlTokenAddress && options.find(option => option.value === urlTokenAddress);

    if ((!urlTokenAddress || !isUrlTokenAddressValid) && defaultTokenAddress) {
      updateUrlTokenAddress({ tokenAddress: defaultTokenAddress });
    }
  }, [options, updateUrlTokenAddress, urlTokenAddress, defaultTokenAddress]);

  // Initialize form
  const isFormInitializedRef = useRef(false);

  const { data: tokenPriceData, isLoading: isGetTokenPriceLoading } = useGetTokenUsdPrice(
    {
      token: selectedAsset?.vToken.underlyingToken,
    },
    {
      enabled: !!selectedAsset,
    },
  );

  const formSchema = useMemo(
    () =>
      z.object({
        stakedAmountXvsTokens: z
          .string()
          .refine(v => validateNumericString(v, primeMinimumStakedXvsTokens)),
        suppliedAmountTokens: z.string().refine(validateNumericString),
        borrowedAmountTokens: z.string().refine(validateNumericString),
      }),
    [primeMinimumStakedXvsTokens],
  );

  const { control, setValue, formState } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: isGetPoolsLoading || isGetTokenPriceLoading,
    mode: 'onBlur',
    defaultValues: {
      stakedAmountXvsTokens: '',
      suppliedAmountTokens: '',
      borrowedAmountTokens: '',
    },
  });

  useEffect(() => {
    const fn = () => {
      if (
        !isGetPoolsLoading &&
        !isGetPrimeStatusLoading &&
        !isFormInitializedRef.current &&
        xvs &&
        getXvsVaultUserInfoData &&
        userStakedXvsTokens &&
        userStakedXvsMantissa?.isGreaterThanOrEqualTo(primeMinimumStakedXvsMantissa) &&
        (selectedAsset?.userBorrowBalanceTokens.isGreaterThan(0) ||
          selectedAsset?.userSupplyBalanceTokens.isGreaterThan(0))
      ) {
        // only set stakedAmountXvsTokens if it wasn't previously edited
        if (!formState.dirtyFields.stakedAmountXvsTokens) {
          setValue('stakedAmountXvsTokens', userStakedXvsTokens.toFixed(), {
            shouldValidate: true,
          });
        }
        setValue('suppliedAmountTokens', selectedAsset.userSupplyBalanceTokens.toFixed());
        setValue('borrowedAmountTokens', selectedAsset.userBorrowBalanceTokens.toFixed());

        // Mark form as initialized
        isFormInitializedRef.current = true;
      }
    };

    fn();
  }, [
    formState,
    getXvsVaultUserInfoData,
    isGetPrimeStatusLoading,
    isGetPoolsLoading,
    primeMinimumStakedXvsMantissa,
    selectedAsset,
    setValue,
    userStakedXvsTokens,
    userStakedXvsMantissa,
    xvs,
  ]);

  const { borrowedAmountTokens, stakedAmountXvsTokens, suppliedAmountTokens } = useWatch({
    control,
  });
  const borrowedAmountMantissa = useDebounceValue(
    selectedAsset && borrowedAmountTokens
      ? convertTokensToMantissa({
          value: new BigNumber(borrowedAmountTokens),
          token: selectedAsset.vToken.underlyingToken,
        })
      : new BigNumber(0),
  );
  const stakedAmountXvsMantissa = useDebounceValue(
    xvs && stakedAmountXvsTokens
      ? convertTokensToMantissa({
          value: new BigNumber(stakedAmountXvsTokens),
          token: xvs,
        })
      : new BigNumber(0),
  );
  const suppliedAmountMantissa = useDebounceValue(
    selectedAsset && suppliedAmountTokens
      ? convertTokensToMantissa({
          value: new BigNumber(suppliedAmountTokens),
          token: selectedAsset.vToken.underlyingToken,
        })
      : new BigNumber(0),
  );

  const { data: primeEstimationData } = useGetPrimeEstimation(
    {
      accountAddress,
      borrowedAmountMantissa,
      stakedAmountXvsMantissa,
      suppliedAmountMantissa,
      vToken: selectedAsset?.vToken,
    },
    {
      enabled:
        !!selectedAsset &&
        formState.isValid &&
        !formState.isValidating &&
        stakedAmountXvsMantissa.gte(primeMinimumStakedXvsMantissa),
    },
  );

  const [borrowCapTokensForXvsStaked, supplyCapTokensForXvsStaked] = useMemo(() => {
    let borrowCapTokens = new BigNumber(0);
    let supplyCapTokens = new BigNumber(0);

    if (tokenPriceData?.tokenPriceUsd && primeEstimationData) {
      const { borrowCapCents, supplyCapCents } = primeEstimationData;
      const tokenPriceCents = convertDollarsToCents(tokenPriceData.tokenPriceUsd);
      borrowCapTokens = borrowCapCents
        ? borrowCapCents.dividedBy(tokenPriceCents)
        : new BigNumber(0);
      supplyCapTokens = supplyCapCents
        ? supplyCapCents.dividedBy(tokenPriceCents)
        : new BigNumber(0);
    }

    return [borrowCapTokens, supplyCapTokens];
  }, [tokenPriceData?.tokenPriceUsd, primeEstimationData]);

  const showInfoXvsMaximumStakedAmount = stakedAmountXvsMantissa.isGreaterThan(
    primeMaximumStakedXvsMantissa,
  );

  if (!xvs) {
    return null;
  }

  if (isGetPrimeStatusLoading || !selectedAsset) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
      <div className="space-y-4">
        <Card>
          <LabeledInlineContent label={t('primeCalculator.tokenSelect.label')}>
            <Select
              options={options}
              optionClassName="px-4 h-14"
              buttonClassName="w-[150px]"
              variant="quaternary"
              size="large"
              value={selectedAsset.vToken.address}
              data-testid={TEST_IDS.tokenSelect}
              onChange={newSelectedTokenAddress => {
                // Mark form as not initialized so it gets reinitialized
                isFormInitializedRef.current = false;
                updateUrlTokenAddress({ tokenAddress: newSelectedTokenAddress as string });
              }}
            />
          </LabeledInlineContent>
        </Card>

        <Card className="space-y-4 lg:space-y-6">
          <Controller
            name="stakedAmountXvsTokens"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                token={xvs}
                label={t('primeCalculator.stakedTokens.textField.label')}
                infosLabel={
                  showInfoXvsMaximumStakedAmount
                    ? t('primeCalculator.stakedTokens.infos.label')
                    : undefined
                }
                infosAmountTokens={primeMaximumStakedXvsTokens}
                infosTooltip={t('primeCalculator.stakedTokens.infos.tooltip', {
                  maximumXvsStaked: formatTokensToReadableValue({
                    value: primeMaximumStakedXvsTokens,
                    token: xvs,
                    maxDecimalPlaces: selectedAsset.vToken.underlyingToken.decimals,
                  }),
                })}
                hasError={!!fieldState.error}
                errorLabel={
                  fieldState.error
                    ? t('primeCalculator.stakedTokens.infos.error', {
                        minimumXvsStaked: primeMinimumStakedXvsTokens.toFixed(),
                      })
                    : undefined
                }
                data-testid={TEST_IDS.stakedAmountTokens}
                {...field}
              />
            )}
          />

          <Delimiter />

          <Controller
            name="suppliedAmountTokens"
            control={control}
            render={({ field }) => (
              <Field
                infosAmountTokens={primeEstimationData.supplyCapTokens}
                token={selectedAsset.vToken.underlyingToken}
                label={t('primeCalculator.suppliedTokens.textField.label', {
                  tokenSymbol: selectedAsset.vToken.underlyingToken.symbol,
                })}
                infosLabel={t('primeCalculator.suppliedTokens.infos.label', {
                  tokenSymbol: selectedAsset.vToken.underlyingToken.symbol,
                })}
                infosTooltip={t('primeCalculator.suppliedTokens.infos.tooltip', {
                  supplyCapTokens: supplyCapTokensForXvsStaked.gt(0)
                    ? formatTokensToReadableValue({
                        value: supplyCapTokensForXvsStaked,
                        token: selectedAsset.vToken.underlyingToken,
                      })
                    : undefined,
                  supplyCapUsd: supplyCapTokensForXvsStaked.gt(0)
                    ? formatCentsToReadableValue({
                        value: primeEstimationData.supplyCapCents,
                      })
                    : undefined,
                  context: supplyCapTokensForXvsStaked.lte(0) ? 'empty' : undefined,
                })}
                data-testid={TEST_IDS.suppliedAmountTokens}
                {...field}
              />
            )}
          />

          <Delimiter />

          <Controller
            name="borrowedAmountTokens"
            control={control}
            render={({ field }) => (
              <Field
                infosAmountTokens={primeEstimationData.borrowCapTokens}
                token={selectedAsset.vToken.underlyingToken}
                label={t('primeCalculator.borrowedTokens.textField.label', {
                  tokenSymbol: selectedAsset.vToken.underlyingToken.symbol,
                })}
                infosLabel={t('primeCalculator.borrowedTokens.infos.label', {
                  tokenSymbol: selectedAsset.vToken.underlyingToken.symbol,
                })}
                infosTooltip={t('primeCalculator.borrowedTokens.infos.tooltip', {
                  borrowCapTokens: borrowCapTokensForXvsStaked.gt(0)
                    ? formatTokensToReadableValue({
                        value: borrowCapTokensForXvsStaked,
                        token: selectedAsset.vToken.underlyingToken,
                      })
                    : '',
                  borrowCapUsd: borrowCapTokensForXvsStaked.gt(0)
                    ? formatCentsToReadableValue({
                        value: primeEstimationData.borrowCapCents,
                      })
                    : '',
                  context: borrowCapTokensForXvsStaked.lte(0) ? 'empty' : undefined,
                })}
                {...field}
                data-testid={TEST_IDS.borrowedAmountTokens}
              />
            )}
          />
        </Card>
      </div>

      <div>
        <RewardDetails
          primeBorrowApy={primeEstimationData.borrowApyPercentage}
          primeSupplyApy={primeEstimationData.supplyApyPercentage}
          token={selectedAsset.vToken.underlyingToken}
          totalDailyRewards={primeEstimationData.dailyTokensDistributedAmount}
          userDailyRewards={primeEstimationData.userDailyPrimeRewards}
          userSuppliedTokens={primeEstimationData.suppliedTokens}
          userBorrowedTokens={primeEstimationData.borrowedTokens}
        />
      </div>
    </div>
  );
};
