import { Icon } from '../Icon';
import { formatHealthFactorToReadableValue } from './formatHealthFactorToReadableValue';

export interface HealthFactorProps {
  factor: number;
  className?: string;
}

export const HealthFactor: React.FC<HealthFactorProps> = ({ factor, ...otherProps }) =>
  factor === Number.POSITIVE_INFINITY ? (
    <Icon name="infinity" {...otherProps} />
  ) : (
    <div {...otherProps}>{formatHealthFactorToReadableValue({ value: factor })}</div>
  );
