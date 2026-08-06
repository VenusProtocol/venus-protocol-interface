import { Chip } from '../Chip';
import type { ChipProps } from '../types';

export const InactiveChip: React.FC<ChipProps> = ({ ...props }) => (
  <Chip {...props} type="inactive" />
);
