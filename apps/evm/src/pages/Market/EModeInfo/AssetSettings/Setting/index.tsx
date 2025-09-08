import { cn } from '@venusprotocol/ui';

import { InfoIcon } from 'components';

export interface SettingProps {
  label: string;
  value: string;
  tooltip?: string;
  className?: string;
}

export const Setting: React.FC<SettingProps> = ({ label, value, tooltip, className }) => (
  <div
    className={cn(
      'flex items-center justify-between space-x-4 sm:block sm:space-y-1 sm:space-x-0',
      className,
    )}
  >
    <div className="flex items-center text-sm">
      <p className="text-sm text-grey">{label}</p>

      {!!tooltip && <InfoIcon className="ml-2 inline-flex items-center" tooltip={tooltip} />}
    </div>

    <div className="flex items-center font-semibold text-sm sm:text-base">{value}</div>
  </div>
);
