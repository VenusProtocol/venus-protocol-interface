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
              className="size-5"
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
      imgSrcs={yieldGroups.map(yieldGroup => yieldGroup.iconSrc)}
      data={yieldGroups}
      rowKeyExtractor={row => row.address}
      columns={columns}
      removeDuplicates
      className={className}
    />
  );
};
