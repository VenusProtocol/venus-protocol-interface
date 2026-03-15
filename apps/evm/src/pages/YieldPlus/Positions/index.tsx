import { useGetYieldPlusPositions } from 'clients/api';
import { Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Placeholder } from 'containers/Placeholder';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { PositionList } from './PositionList';

export const Positions: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: getYieldPositionsData, isLoading } = useGetYieldPlusPositions(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const positions = getYieldPositionsData?.positions || [];

  if (isLoading) {
    return <Spinner />;
  }

  if (positions.length === 0) {
    return <Placeholder iconName="wallet" title={t('yieldPlus.positions.placeholder.title')} />;
  }

  return <PositionList positions={positions} />;
};
