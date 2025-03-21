import { Button, type ButtonProps, cn } from '@venusprotocol/ui';
import { Anchor } from '../Anchor';

export interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  variant?: ButtonProps['variant'];
}

const Link: React.FC<ILinkProps> = ({ className, variant, ...props }) => (
  <Button
    component={Anchor}
    variant={variant}
    className={cn('w-auto', variant === 'text' && 'font-normal', className)}
    {...props}
  />
);

export default Link;
