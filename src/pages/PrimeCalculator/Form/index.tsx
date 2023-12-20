import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetLegacyPool } from 'clients/api';
import {
  Card,
  LabeledInlineContent,
  Select,
  SelectOption,
  Spinner,
  TokenIconWithSymbol,
} from 'components';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { Token } from 'types';

import { RewardDetails } from './RewardDetails';

const QUERY_PARAM_TOKEN_ADDRESS = 'tokenAddress';

export const Form: React.FC = () => {
  const { t } = useTranslation();
  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolLoading } = useGetLegacyPool();
  const [searchParams, setSearchParams] = useSearchParams();

  const usdt = useGetToken({
    symbol: 'USDT',
  });

  const options = useMemo(() => {
    // Extract tokens affected by Prime
    const primeTokens = (getLegacyPoolData?.pool.assets || []).reduce<Token[]>((acc, asset) => {
      const distributions = asset.borrowDistributions.concat(asset.supplyDistributions);
      const hasPrimeDistribution = distributions.some(
        distribution => distribution.type === 'prime' || distribution.type === 'primeSimulation',
      );

      return hasPrimeDistribution ? [...acc, asset.vToken.underlyingToken] : acc;
    }, []);

    // Generate options from tokens affected by Prime
    const selectOptions: SelectOption[] = primeTokens.map(primeToken => ({
      label: () => <TokenIconWithSymbol token={primeToken} />,
      value: primeToken.address,
    }));

    return selectOptions;
  }, [getLegacyPoolData?.pool.assets]);

  // Detect token address query param change and update form accordingly
  useEffect(() => {
    const tokenAddressParam = searchParams.get(QUERY_PARAM_TOKEN_ADDRESS);
    const isTokenAddressParamValid =
      tokenAddressParam && options.find(option => option.value === tokenAddressParam);

    // Set default tokenAddress query param if none is present in the URL
    if (!isTokenAddressParamValid && options.length > 0) {
      setSearchParams(
        {
          ...searchParams,
          [QUERY_PARAM_TOKEN_ADDRESS]: String(options[0].value),
        },
        {
          replace: true,
        },
      );
    }
  }, [searchParams, setSearchParams, options]);

  // TODO: set form field value (use useEffect hook)

  if (!usdt) {
    return null;
  }

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
      <div className="space-y-4">
        <Card>
          <LabeledInlineContent label={t('primeSimulator.tokenSelect.label')}>
            {isGetLegacyPoolLoading ? (
              <Spinner />
            ) : (
              <Select
                // TODO: wire up
                value={usdt.address}
                onChange={tokenAddress => console.log(tokenAddress)}
                options={options}
                className="w-[150px"
                buttonClassName="bg-lightGrey hover:border-blue"
              />
            )}
          </LabeledInlineContent>
        </Card>
      </div>

      <RewardDetails
        primeBorrowApy="-"
        primeSupplyApy="-"
        token={usdt}
        totalYearlyRewards="-"
        userYearlyRewards="-"
        userSuppliedTokens="-"
        userBorrowedTokens="-"
      />
    </div>
  );
};
