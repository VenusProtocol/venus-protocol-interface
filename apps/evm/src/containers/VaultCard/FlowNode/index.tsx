import { cn } from 'components';

export const FlowNode: React.FC<{
  variant?: 'primary' | 'line';
  children: React.ReactNode;
}> = ({ children, variant }) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-lg px-4 py-2.5',
      variant === 'primary' ? 'bg-brand' : 'border border-default bg-transparent',
    )}
  >
    <span className={cn('text-b1r', variant === 'primary' ? 'text-on-color' : 'text-primary')}>
      {children}
    </span>
  </div>
);
