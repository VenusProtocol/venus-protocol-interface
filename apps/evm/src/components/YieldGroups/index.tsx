import { cn } from '@venusprotocol/ui';

import { ImgGroup, Table, type TableColumn, Tooltip } from 'components';
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
    <Tooltip
      content={
        <Table
          data={yieldGroups}
          rowKeyExtractor={row => row.address}
          columns={columns}
          variant="secondary"
          className="border-0 p-0"
          tableRowClassName="h-12"
          tableHeaderClassName="h-12"
        />
      }
      className={cn('inline-flex', className)}
      contentClassName="p-0 max-h-49 overflow-y-auto"
    >
      <ImgGroup
        imgSrcs={yieldGroups.map(yieldGroup => yieldGroup.iconSrc)}
        removeDuplicates
        limit={5}
      />
    </Tooltip>
  );
};
