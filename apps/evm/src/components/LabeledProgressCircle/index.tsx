import { cn } from '@venusprotocol/ui';
import { ProgressCircle } from '../ProgressCircle';

export interface LabeledProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  total: number;
}

export const LabeledProgressCircle: React.FC<LabeledProgressCircleProps> = ({
  className,
  value,
  total,
  ...otherProps
}) => (
  <div
    className={cn('relative ml-3 w-10 h-10 flex items-center justify-center', className)}
    {...otherProps}
  >
    <ProgressCircle
      className="absolute inset"
      value={(value * 100) / total}
      sizePx={40}
      strokeWidthPx={4}
    />

    <p className="text-sm text-center">
      {value}/{total}
    </p>
  </div>
);
