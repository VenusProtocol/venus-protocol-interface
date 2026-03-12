import { useGetYieldPlusPositions } from 'clients/api';
import { Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Placeholder } from 'containers/Placeholder';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { PositionList } from './PositionList';

export interface PositionsProps {
  className?: string;
}

export const Positions: React.FC<PositionsProps> = ({ className }) => {
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

  return (
    <div className={className}>
      {isLoading && <Spinner />}

      {positions.length === 0 ? (
        <Placeholder iconName="wallet" title={t('yieldPlus.positions.placeholder.title')} />
      ) : (
        <PositionList positions={positions} />
      )}
    </div>
  );
};
