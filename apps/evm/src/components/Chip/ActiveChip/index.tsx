import { Chip } from '../Chip';
import type { ChipProps } from '../types';

export const ActiveChip: React.FC<ChipProps> = ({ ...props }) => <Chip {...props} type="active" />;
