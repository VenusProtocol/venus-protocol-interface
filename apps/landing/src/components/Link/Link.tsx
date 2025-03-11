import { type ButtonProps, ButtonWrapper, cn } from '@venusprotocol/ui';
import type { ReactNode } from 'react';

export interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  children: ReactNode;
  variant?: ButtonProps['variant'];
}

const Link: React.FC<ILinkProps> = ({ className, children, variant, ...props }) => (
  <ButtonWrapper
    asChild
    variant={variant}
    className={cn('w-auto', variant === 'text' && 'font-normal', className)}
  >
    <a {...props}>{children}</a>
  </ButtonWrapper>
);
export default Link;
