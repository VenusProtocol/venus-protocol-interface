import { useGetPool } from 'clients/api';
import { Spinner } from 'components';
import { useChain } from 'hooks/useChain';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Placeholder } from '../Placeholder';
import { Tabs } from './Tabs';

export const Markets: React.FC = () => {
  const { t } = useTranslation();

  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;

  if (isGetPoolLoading) {
    return <Spinner />;
  }

  if (!pool?.userSupplyBalanceCents?.isGreaterThan(0)) {
    return <Placeholder iconName="venus" title={t('dashboard.pools.placeholder.title')} />;
  }

  return <Tabs pool={pool} />;
};
