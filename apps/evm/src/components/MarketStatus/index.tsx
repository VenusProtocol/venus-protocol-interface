import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import { Cell } from './Cell';

export interface MarketStatusProp {
  isBorrowable: boolean;
  canBeCollateral: boolean;
  className?: string;
}

export const MarketStatus: React.FC<MarketStatusProp> = ({
  canBeCollateral,
  isBorrowable,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex items-center w-full border border-lightGrey rounded-lg sm:border-0 sm:w-auto sm:gap-x-2',
        className,
      )}
    >
      <Cell
        className="border-r border-lightGrey sm:border-r-0"
        isAvailable={canBeCollateral}
        label={t('markets.eMode.table.card.header.collateral')}
      />

      <Cell isAvailable={isBorrowable} label={t('markets.eMode.table.card.header.borrowable')} />
    </div>
  );
};
