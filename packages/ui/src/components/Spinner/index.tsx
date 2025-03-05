import { cn } from '../../utilities/cn';

import spinnerAnimation from './spinnerAnimation.gif';

export interface SpinnerProps {
  variant?: 'large' | 'small';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ variant = 'large', className }) => (
  <div
    className={cn(
      'flex items-center justify-center',
      variant === 'large' && 'h-full w-full',
      className,
    )}
  >
    <img
      className={cn(variant === 'large' ? 'h-7 w-7' : 'h-5 w-5')}
      src={spinnerAnimation}
      alt="Spinner"
    />
  </div>
);
