export type ChipType = 'default' | 'active' | 'inactive' | 'blue' | 'error';

export interface ChipProps {
  text: string;
  type?: ChipType;
  className?: string;
  icon?: React.ReactNode;
}
