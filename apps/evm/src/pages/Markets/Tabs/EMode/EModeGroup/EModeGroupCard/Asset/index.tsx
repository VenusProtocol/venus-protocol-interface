import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { LabeledInlineContent, type TableColumn } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import type { EModeAssetSettings } from 'types';

export interface AssetProps {
  eModeAssetSettings: EModeAssetSettings;
  isEModeGroupActive: boolean;
  columns: TableColumn<EModeAssetSettings>[];
  poolComptrollerAddress: Address;
  className?: string;
}

export const Asset: React.FC<AssetProps> = ({
  eModeAssetSettings,
  isEModeGroupActive,
  columns,
  poolComptrollerAddress,
  className,
}) => {
  const { formatTo } = useFormatTo();

  const to = formatTo({
    to: routes.market.path
      .replace(':poolComptrollerAddress', poolComptrollerAddress)
      .replace(':vTokenAddress', eModeAssetSettings.vToken.address),
  });

  const dataListItems = columns
    // Remove first column which corresponds to the asset
    .slice(1)
    .map((column, index) => ({
      label: column.label,
      value: column.renderCell(eModeAssetSettings, index),
    }));

  return (
    <Link noStyle className={cn('space-y-3 block', className)} to={to}>
      <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0">
        {/* Render token icon */}
        {columns[0].renderCell(eModeAssetSettings, 0)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {dataListItems.map((item, index) => (
          <LabeledInlineContent key={item.label?.toString() ?? index} label={item.label}>
            <span className={cn(!isEModeGroupActive && 'text-grey opacity-50')}>{item.value}</span>
          </LabeledInlineContent>
        ))}
      </div>
    </Link>
  );
};
