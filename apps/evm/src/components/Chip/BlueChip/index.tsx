import { Chip } from '../Chip';
import type { ChipProps } from '../types';

export const BlueChip: React.FC<ChipProps> = ({ ...props }) => <Chip {...props} type="blue" />;
