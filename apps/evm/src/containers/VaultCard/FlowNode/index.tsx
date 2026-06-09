import { cn } from 'components';

export const FlowNode: React.FC<{
  variant?: 'primary' | 'line';
  children: React.ReactNode;
}> = ({ children, variant }) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-lg px-4 py-2.5',
      variant === 'primary' ? 'bg-blue' : 'border border-dark-blue-hover bg-transparent',
    )}
  >
    <span className="text-b1r text-white">{children}</span>
  </div>
);
