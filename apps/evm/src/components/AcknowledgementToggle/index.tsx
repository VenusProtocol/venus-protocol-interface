import { cn } from '@venusprotocol/ui';
import { NoticeError, Toggle, type ToggleProps } from 'components';

export type AcknowledgementToggleProps = Omit<ToggleProps, 'label' | 'tooltip'> & {
  label: string;
  tooltip: string;
};

export const AcknowledgementToggle: React.FC<AcknowledgementToggleProps> = ({
  className,
  label,
  tooltip,
  ...toggleProps
}) => (
  <div className={cn('space-y-3', className)}>
    <NoticeError description={tooltip} size="sm" />

    <div className="flex gap-x-3">
      <Toggle {...toggleProps} />

      <p className="text-sm">{label}</p>
    </div>
  </div>
);
