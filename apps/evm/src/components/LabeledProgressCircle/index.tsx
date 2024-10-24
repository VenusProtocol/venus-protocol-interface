import { cn } from 'utilities';
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
    className={cn('relative ml-3 w-11 h-11 flex items-center justify-center', className)}
    {...otherProps}
  >
    <ProgressCircle className="absolute inset" value={(value * 100) / total} />

    <p className="text-sm text-center">
      {value}/{total}
    </p>
  </div>
);
