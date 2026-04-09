import { Spinner } from 'components';
import { Placeholder } from 'containers/Placeholder';
import { useGetYieldPlusPositions } from 'hooks/useGetYieldPlusPositions';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { PositionList } from './PositionList';

export interface PositionsProps {
  className?: string;
}

export const Positions: React.FC<PositionsProps> = ({ className }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: getYieldPositionsData, isLoading } = useGetYieldPlusPositions({
    accountAddress,
  });

  const positions = getYieldPositionsData?.positions || [];

  return (
    <div className={className}>
      {isLoading && <Spinner />}

      {!isLoading && positions.length === 0 && (
        <Placeholder iconName="wallet" title={t('yieldPlus.positions.placeholder.title')} />
      )}

      {!isLoading && positions.length > 0 && <PositionList positions={positions} />}
    </div>
  );
};
