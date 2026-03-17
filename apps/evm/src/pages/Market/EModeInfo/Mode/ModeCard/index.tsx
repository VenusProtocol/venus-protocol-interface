import { cn } from '@venusprotocol/ui';

import { Delimiter, LabeledInlineContent, type Order, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import type { EModeGroup } from 'types';
import type { ExtendedEModeAssetSettings } from '../types';

export interface ModeCardProps {
  columns: TableColumn<ExtendedEModeAssetSettings>[];
  eModeAssetSettings: ExtendedEModeAssetSettings[];
  rowOnClick: (e: React.MouseEvent<HTMLDivElement>, row: EModeGroup) => void;
  order: Order<ExtendedEModeAssetSettings>;
  className?: string;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  eModeAssetSettings,
  columns,
  rowOnClick,
  order,
  className,
}) => {
  const { t } = useTranslation();

  const sortedEModeAssetSettings = order.orderBy.sortRows
    ? [...eModeAssetSettings].sort((rowA, rowB) =>
        order.orderBy.sortRows!(rowA, rowB, order.orderDirection),
      )
    : eModeAssetSettings;

  return (
    <div className={cn('space-y-6 px-6 md:hidden lg:block 2xl:hidden', className)}>
      {sortedEModeAssetSettings.map((row, rowIndex) => (
        <div className="space-y-6" key={`${row.eModeGroup.name}-${row.vToken.address}`}>
          <div key={row.eModeGroup.name} className="space-y-4">
            <div>{columns[0].renderCell(row, rowIndex)}</div>

            <div className="grid grid-cols-2 gap-3">
              {columns.slice(1).map(column => (
                <LabeledInlineContent label={column.label} key={column.key}>
                  {column.renderCell(row, rowIndex)}
                </LabeledInlineContent>
              ))}

              <p
                className="text-blue cursor-pointer text-right duration-250 hover:underline hover:text-blue-hover active:text-blue-active"
                onClick={e => rowOnClick(e, row.eModeGroup)}
              >
                {t('market.eModeInfo.link')}
              </p>
            </div>
          </div>

          {rowIndex < eModeAssetSettings.length - 1 && <Delimiter />}
        </div>
      ))}
    </div>
  );
};
