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
import { useTranslation } from 'packages/translations';
import { Token } from 'types';

const QUERY_PARAM_TOKEN_ADDRESS = 'tokenAddress';

export const Form: React.FC = () => {
  const { t } = useTranslation();
  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolLoading } = useGetLegacyPool();
  const [searchParams, setSearchParams] = useSearchParams();

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

    // Set default tokenAddress query param if none is present in the URL
    if (!tokenAddressParam && options.length > 0) {
      setSearchParams({
        ...searchParams,
        [QUERY_PARAM_TOKEN_ADDRESS]: String(options[0].value),
      });
    }

    // TODO: set form field value
  }, [searchParams, setSearchParams, options]);

  return (
    <Card>
      <LabeledInlineContent label={t('primeSimulator.tokenSelect.label')}>
        {isGetLegacyPoolLoading ? (
          <Spinner />
        ) : (
          <Select value={''} onChange={value => ''} options={options} className="w-[150px]" />
        )}
      </LabeledInlineContent>
    </Card>
  );
};
