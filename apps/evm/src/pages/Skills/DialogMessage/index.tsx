import { cn } from '@venusprotocol/ui';

interface DialogMessageProps {
  variant: 'user' | 'agent';
  children: React.ReactNode;
}

export const DialogMessage: React.FC<DialogMessageProps> = ({ variant, children }) => (
  <div
    className={cn('my-3', variant === 'user' && 'text-orange', variant === 'agent' && 'text-green')}
  >
    {children}
  </div>
);
