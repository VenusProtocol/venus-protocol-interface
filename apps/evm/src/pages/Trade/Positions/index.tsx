import { Spinner } from 'components';
import { Placeholder } from 'containers/Placeholder';
import { useGetTradePositions } from 'hooks/useGetTradePositions';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { PositionList } from './PositionList';

export interface PositionsProps {
  className?: string;
}

export const Positions: React.FC<PositionsProps> = ({ className }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: getTradeData, isLoading } = useGetTradePositions({
    accountAddress,
  });

  const positions = getTradeData?.positions || [];

  return (
    <div className={className}>
      {isLoading && <Spinner />}

      {!isLoading && positions.length === 0 && (
        <Placeholder iconName="wallet" title={t('trade.positions.placeholder.title')} />
      )}

      {!isLoading && positions.length > 0 && <PositionList positions={positions} />}
    </div>
  );
};
