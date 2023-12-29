import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useFormState, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import {
  useGetLegacyPool,
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
  SelectOption,
  Spinner,
  TokenIconWithSymbol,
} from 'components';
import FunctionKey from 'constants/functionKey';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { useAccountAddress, useChainId } from 'packages/wallet';
import { Asset } from 'types';
import {
  areAddressesEqual,
  convertDollarsToCents,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import TEST_IDS from '../testIds';
import { Field } from './Field';
import { RewardDetails } from './RewardDetails';
import { getInitialValues } from './getInitialValues';
import { validateNumericString } from './validateNumericString';

export const QUERY_PARAM_TOKEN_ADDRESS = 'tokenAddress';

export const Form: React.FC = () => {
  const { chainId } = useChainId();
  const { t } = useTranslation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const { accountAddress } = useAccountAddress();
  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolLoading } = useGetLegacyPool(
    {
      accountAddress,
    },
    {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      queryKey: [FunctionKey.GET_LEGACY_POOL, { accountAddress, chainId }, 'PrimeCalculator'],
    },
  );
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
      rewardTokenAddress: xvs?.address || '',
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress && !!xvs && typeof xvsVaultPoolIndex === 'number',
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  const userXvsStakedMantissa = useMemo(
    () =>
      getXvsVaultUserInfoData
        ? getXvsVaultUserInfoData.stakedAmountMantissa.minus(
            getXvsVaultUserInfoData.pendingWithdrawalsTotalAmountMantissa,
          )
        : undefined,
    [getXvsVaultUserInfoData],
  );

  const [searchParams, setSearchParams] = useSearchParams();

  // Extract assets affected by Prime
  const primeAssets = useMemo(
    () =>
      (getLegacyPoolData?.pool.assets || []).reduce<Asset[]>((acc, asset) => {
        const distributions = asset.borrowDistributions.concat(asset.supplyDistributions);
        const hasPrimeDistribution = distributions.some(
          distribution => distribution.type === 'prime' || distribution.type === 'primeSimulation',
        );

        return hasPrimeDistribution ? [...acc, asset] : acc;
      }, []),
    [getLegacyPoolData?.pool.assets],
  );

  // Generate options from tokens affected by Primes
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
    const fn = () => {
      const isUrlTokenAddressValid =
        urlTokenAddress && options.find(option => option.value === urlTokenAddress);

      if ((!urlTokenAddress || !isUrlTokenAddressValid) && defaultTokenAddress) {
        updateUrlTokenAddress({ tokenAddress: defaultTokenAddress });
      }
    };

    fn();
  }, [options, updateUrlTokenAddress, urlTokenAddress, defaultTokenAddress]);

  const formSchema = z.object({
    stakedAmountXvsTokens: z
      .string()
      .refine(v => validateNumericString(v, primeMinimumStakedXvsTokens)),
    suppliedAmountTokens: z.string().refine(validateNumericString),
    borrowedAmountTokens: z.string().refine(validateNumericString),
  });

  const { control, setValue, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      stakedAmountXvsTokens: '',
      suppliedAmountTokens: '',
      borrowedAmountTokens: '',
    },
  });

  const formState = useFormState({ control });

  // Load default form values
  const defaultValues = useMemo(() => {
    let initialStakedAmountXvsTokens;
    let initialBorrowAmountTokens;
    let initialSupplyAmountTokens;
    if (selectedAsset && xvs) {
      ({ initialStakedAmountXvsTokens, initialBorrowAmountTokens, initialSupplyAmountTokens } =
        getInitialValues({
          assetData: selectedAsset,
          primeMinimumStakedXvsMantissa,
          userXvsStakedMantissa,
          xvs,
        }));
    }
    return {
      initialStakedAmountXvsTokens,
      initialBorrowAmountTokens,
      initialSupplyAmountTokens,
    };
  }, [selectedAsset, xvs, primeMinimumStakedXvsMantissa, userXvsStakedMantissa]);

  const { initialStakedAmountXvsTokens, initialBorrowAmountTokens, initialSupplyAmountTokens } =
    defaultValues;
  useEffect(() => {
    const stakedAmountXvsTokens = initialStakedAmountXvsTokens?.gt(0)
      ? initialStakedAmountXvsTokens.toFixed()
      : '';
    const borrowedAmountTokens = initialBorrowAmountTokens?.gt(0)
      ? initialBorrowAmountTokens.toFixed()
      : '';
    const suppliedAmountTokens = initialSupplyAmountTokens?.gt(0)
      ? initialSupplyAmountTokens.toFixed()
      : '';
    if (formState.touchedFields.stakedAmountXvsTokens) {
      setValue('borrowedAmountTokens', borrowedAmountTokens);
      setValue('suppliedAmountTokens', suppliedAmountTokens);
    } else {
      reset({
        stakedAmountXvsTokens,
        suppliedAmountTokens,
        borrowedAmountTokens,
      });
    }
  }, [
    initialStakedAmountXvsTokens,
    initialBorrowAmountTokens,
    initialSupplyAmountTokens,
    formState.touchedFields.stakedAmountXvsTokens,
    setValue,
    reset,
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

  const { data: tokenPriceData, isLoading: isGetTokenPriceLoading } = useGetTokenUsdPrice(
    {
      token: selectedAsset?.vToken.underlyingToken,
    },
    {
      enabled: !!selectedAsset,
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

  const [showMinimumXvsStakedError, setShowMinimumXvsStakedError] = useState(false);
  useEffect(() => {
    if (formState.errors.stakedAmountXvsTokens) {
      setShowMinimumXvsStakedError(true);
    } else {
      setShowMinimumXvsStakedError(false);
    }
  }, [formState.errors.stakedAmountXvsTokens]);

  const showInfoXvsMaximumStakedAmount = new BigNumber(stakedAmountXvsMantissa).isGreaterThan(
    primeMaximumStakedXvsMantissa,
  );

  if (!xvs) {
    return null;
  }

  if (
    isGetLegacyPoolLoading ||
    isGetPrimeStatusLoading ||
    !selectedAsset ||
    isGetTokenPriceLoading
  ) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
      <div className="space-y-4">
        <Card>
          <LabeledInlineContent label={t('primeCalculator.tokenSelect.label')}>
            <Select
              options={options}
              className="w-[150px]"
              buttonClassName="bg-lightGrey hover:border-blue"
              value={selectedAsset.vToken.address}
              testId={TEST_IDS.tokenSelect}
              onChange={newSelectedTokenAddress =>
                updateUrlTokenAddress({ tokenAddress: newSelectedTokenAddress as string })
              }
            />
          </LabeledInlineContent>
        </Card>

        <Card className="space-y-4 lg:space-y-6">
          <Controller
            name="stakedAmountXvsTokens"
            control={control}
            render={({ field }) => (
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
                  }),
                })}
                hasError={showMinimumXvsStakedError}
                errorLabel={
                  showMinimumXvsStakedError
                    ? t('primeCalculator.stakedTokens.infos.error', {
                        minimumXvsStaked: primeMinimumStakedXvsTokens.toFixed(),
                      })
                    : undefined
                }
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
