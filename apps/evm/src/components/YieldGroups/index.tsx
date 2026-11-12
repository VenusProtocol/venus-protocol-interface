import { cn } from '@venusprotocol/ui';
import { ImgGroupTooltip, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiquidityHubYieldGroup } from 'types';

export interface YieldGroupsProps {
  yieldGroups: LiquidityHubYieldGroup[];
  className?: string;
}

export const YieldGroups: React.FC<YieldGroupsProps> = ({ yieldGroups, className }) => {
  const { t } = useTranslation();

  const columns: TableColumn<LiquidityHubYieldGroup>[] = [
    {
      label: t('yieldsGroups.protocol'),
      selectOptionLabel: t('yieldsGroups.protocol'),
      key: 'protocol',
      renderCell: yieldGroup => {
        const name = t(yieldGroup.nameTranslationKey);

        return (
          <div className="flex items-center gap-x-2">
            <img
              alt={name}
              className={cn('size-5', yieldGroup.iconClassName)}
              src={yieldGroup.iconSrc}
              key={`img-group-item-${yieldGroup.address}`}
            />

            <span className="text-b1r">{name}</span>
          </div>
        );
      },
    },
  ];

  return (
    <ImgGroupTooltip
      imgs={yieldGroups.map(yieldGroup => ({
        src: yieldGroup.iconSrc,
        alt: t(yieldGroup.nameTranslationKey),
        className: yieldGroup.iconClassName,
      }))}
      data={yieldGroups}
      rowKeyExtractor={row => row.address}
      columns={columns}
      removeDuplicates
      className={className}
    />
  );
};
