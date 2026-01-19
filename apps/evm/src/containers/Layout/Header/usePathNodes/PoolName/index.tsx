import { useGetPool } from 'clients/api';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useChain } from 'hooks/useChain';
import { useTranslation } from 'libs/translations';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

export interface PoolNameProps {
  poolComptrollerAddress: Address;
}

const PoolName: React.FC<PoolNameProps> = ({ poolComptrollerAddress }) => {
  const { t } = useTranslation();

  const { corePoolComptrollerContractAddress } = useChain();
  const isCorePool = areAddressesEqual(poolComptrollerAddress, corePoolComptrollerContractAddress);

  const { data: getPools } = useGetPool({
    poolComptrollerAddress,
  });

  let poolName = getPools?.pool?.name;

  if (isCorePool) {
    poolName = t('breadcrumbs.markets');
  }

  return <>{poolName || PLACEHOLDER_KEY}</>;
};

export default PoolName;
