import { cn } from '@venusprotocol/ui';

import { Card, Cell, type CellProps } from 'components';
import { useTranslation } from 'libs/translations';
import type { Pool, Vault } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import { useExtractData } from '../useExtractData';
import circularGradientSrc from './circularGradient.svg';

export interface SummaryProps {
  pools: Pool[];
  vaults?: Vault[];
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  className?: string;
}

export const Summary: React.FC<SummaryProps> = ({
  className,
  pools,
  vaults,
  xvsPriceCents,
  vaiPriceCents,
}) => {
  const { t } = useTranslation();

  const {
    dailyEarningsCents,
    totalSupplyCents,
    totalBorrowCents,
    totalVaultStakeCents,
    totalVaiBorrowBalanceCents,
    netApyPercentage,
  } = useExtractData({
    pools,
    vaults,
    xvsPriceCents,
    vaiPriceCents,
  });

  const cells: CellProps[] = [
    {
      label: t('account.summary.cellGroup.netApy'),
      value: formatPercentageToReadableValue(netApyPercentage),
      tooltip: vaults
        ? t('account.summary.cellGroup.netApyWithVaultStakeTooltip')
        : t('account.summary.cellGroup.netApyTooltip'),
      className:
        typeof netApyPercentage === 'number' && netApyPercentage < 0 ? 'text-red' : 'text-green',
    },
    {
      label: t('account.summary.cellGroup.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarningsCents }),
    },
    {
      label: t('account.summary.cellGroup.totalSupply'),
      value: formatCentsToReadableValue({ value: totalSupplyCents }),
    },
    {
      label: t('account.summary.cellGroup.totalBorrow'),
      value: formatCentsToReadableValue({ value: totalBorrowCents }),
    },
  ];

  if (totalVaultStakeCents) {
    cells.push({
      label: t('account.summary.cellGroup.totalVaultStake'),
      value: formatCentsToReadableValue({ value: totalVaultStakeCents }),
    });
  }

  if (totalVaiBorrowBalanceCents) {
    cells.push({
      label: t('account.summary.cellGroup.mintedVai'),
      value: formatCentsToReadableValue({ value: totalVaiBorrowBalanceCents }),
    });
  }

  // Sort cells in rows of 2
  const rowCount = Math.ceil(cells.length / 2);
  const cellRows: CellProps[][] = [];

  for (let i = 0; i < rowCount; i++) {
    const index = i * 2; // 2 items per row
    const row = [cells[index]];

    if (cells[index + 1]) {
      row.push(cells[index + 1]);
    }

    cellRows.push(row);
  }

  return (
    <Card className={cn('py-6 relative overflow-hidden rounded-2xl', className)}>
      <img
        src={circularGradientSrc}
        alt={t('account.circularGradient')}
        className="absolute max-w-none w-120 left-[50%] -translate-x-[50%] -bottom-55 sm:w-187 sm:-bottom-110 lg:w-120 lg:-bottom-55"
      />

      <div className="relative">
        <h2 className="mb-6 text-lg">{t('account.summary.title')}</h2>

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-1 lg:gap-x-0">
          {cellRows.map((cellRow, cellRowIndex) => (
            <div
              key={cellRow[0].label}
              className="flex border-b border-b-white/10 pb-6 last-of-type:border-b-0 last-of-type:pb-0 sm:border-b-0 sm:pb-0 sm:grid sm:grid-cols-2 sm:gap-x-6 lg:border-b lg:flex lg:gap-x-0 lg:pb-6"
            >
              {cellRow.map(cell => (
                <Cell
                  {...cell}
                  key={cell.label}
                  className={cn(
                    'flex-1 sm:border-r sm:border-r-white/10 lg:border-r-0',
                    (cellRowIndex % 2 !== 0 || cellRowIndex === cellRows.length - 1) &&
                      'sm:last-of-type:border-r-0',
                    cell.className,
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
