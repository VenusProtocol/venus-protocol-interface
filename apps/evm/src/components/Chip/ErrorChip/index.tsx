import { Chip } from '../Chip';
import type { ChipProps } from '../types';

export const ErrorChip: React.FC<ChipProps> = ({ ...props }) => <Chip {...props} type="error" />;
