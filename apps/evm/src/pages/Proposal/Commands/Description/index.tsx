import { cn } from 'utilities';

export interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'warning' | 'info';
}

export const Description: React.FC<DescriptionProps> = ({ type = 'info', ...otherProps }) => (
  <p
    className={cn('text-sm md:pl-8 text-grey', type === 'warning' && 'text-orange')}
    {...otherProps}
  />
);
