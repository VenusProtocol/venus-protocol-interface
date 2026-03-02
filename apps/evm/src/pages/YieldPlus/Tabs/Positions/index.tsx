import { useGetYieldPlusPositions } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { Placeholder } from 'containers/Placeholder';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { PositionTable } from './PositionTable';

export const Positions: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: getYieldPositionsData } = useGetYieldPlusPositions(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const positions = getYieldPositionsData?.positions || [];

  if (positions.length === 0) {
    return (
      <Placeholder iconName="wallet" title={t('yieldPlus.tabs.positions.placeholder.title')} />
    );
  }

  return <PositionTable positions={positions} />;
};
