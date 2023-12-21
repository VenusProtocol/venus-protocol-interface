import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { useGetLegacyPool } from 'clients/api';
import {
  Card,
  Delimiter,
  LabeledInlineContent,
  Select,
  SelectOption,
  Spinner,
  TokenIconWithSymbol,
} from 'components';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { Token } from 'types';
import { areAddressesEqual } from 'utilities';

import TEST_IDS from '../testIds';
import { Field } from './Field';
import { RewardDetails } from './RewardDetails';

export const QUERY_PARAM_TOKEN_ADDRESS = 'tokenAddress';

const formSchema = z.object({
  stakedAmountXvs: z.string().min(1),
  suppliedAmountTokens: z.string().min(1),
  borrowedAmountTokens: z.string().min(1),
});

export const Form: React.FC = () => {
  const { t } = useTranslation();
  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolLoading } = useGetLegacyPool();

  const [searchParams, setSearchParams] = useSearchParams();

  const { setValue, control } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stakedAmountXvs: '',
      suppliedAmountTokens: '',
      borrowedAmountTokens: '',
    },
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  // Extract tokens affected by Prime
  const primeTokens = useMemo(
    () =>
      (getLegacyPoolData?.pool.assets || []).reduce<Token[]>((acc, asset) => {
        const distributions = asset.borrowDistributions.concat(asset.supplyDistributions);
        const hasPrimeDistribution = distributions.some(
          distribution => distribution.type === 'prime' || distribution.type === 'primeSimulation',
        );

        return hasPrimeDistribution ? [...acc, asset.vToken.underlyingToken] : acc;
      }, []),
    [getLegacyPoolData?.pool.assets],
  );

  // Generate options from tokens affected by Primes
  const options = useMemo(() => {
    const selectOptions: SelectOption[] = primeTokens.map(primeToken => ({
      label: () => <TokenIconWithSymbol token={primeToken} />,
      value: primeToken.address,
    }));

    return selectOptions;
  }, [primeTokens]);

  const defaultTokenAddress = options[0]?.value as string | undefined;

  const urlTokenAddress = searchParams.get(QUERY_PARAM_TOKEN_ADDRESS);
  const selectedToken = useMemo(
    () =>
      urlTokenAddress
        ? primeTokens.find(token => areAddressesEqual(token.address, urlTokenAddress))
        : undefined,
    [urlTokenAddress, primeTokens],
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
  }, [options, updateUrlTokenAddress, setValue, urlTokenAddress, defaultTokenAddress]);

  if (!xvs) {
    return null;
  }

  if (isGetLegacyPoolLoading || !selectedToken) {
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
              value={selectedToken.address}
              testId={TEST_IDS.tokenSelect}
              onChange={newSelectedTokenAddress =>
                updateUrlTokenAddress({ tokenAddress: newSelectedTokenAddress as string })
              }
            />
          </LabeledInlineContent>
        </Card>

        <Card className="space-y-4 lg:space-y-6">
          <Controller
            name="stakedAmountXvs"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Field
                token={xvs}
                label={t('primeCalculator.stakedTokens.textField.label')}
                {...field}
              />
            )}
          />

          <Delimiter />

          <Controller
            name="suppliedAmountTokens"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Field
                token={selectedToken}
                label={t('primeCalculator.suppliedTokens.textField.label', {
                  tokenSymbol: selectedToken.symbol,
                })}
                infosLabel={t('primeCalculator.suppliedTokens.infos.label', {
                  tokenSymbol: selectedToken.symbol,
                })}
                // TODO: define tooltip text
                infosTooltip={t('primeCalculator.suppliedTokens.infos.tooltip')}
                {...field}
              />
            )}
          />

          <Delimiter />

          <Controller
            name="borrowedAmountTokens"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Field
                token={selectedToken}
                label={t('primeCalculator.borrowedTokens.textField.label', {
                  tokenSymbol: selectedToken.symbol,
                })}
                infosLabel={t('primeCalculator.borrowedTokens.infos.label', {
                  tokenSymbol: selectedToken.symbol,
                })}
                // TODO: define tooltip text
                infosTooltip={t('primeCalculator.borrowedTokens.infos.tooltip')}
                {...field}
              />
            )}
          />
        </Card>
      </div>

      <div>
        <RewardDetails
          primeBorrowApy="-"
          primeSupplyApy="-"
          token={selectedToken}
          totalYearlyRewards="-"
          userYearlyRewards="-"
          userSuppliedTokens="-"
          userBorrowedTokens="-"
        />
      </div>
    </div>
  );
};
