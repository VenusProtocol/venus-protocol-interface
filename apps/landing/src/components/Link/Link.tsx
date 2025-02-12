import cn from 'classnames';
import type { ReactNode } from 'react';
import s from './Link.module.css';

interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  children: ReactNode;
  variant?: 'button' | 'buttonTransparent' | 'link';
}

const Link: React.FC<ILinkProps> = ({ className, children, variant = 'button', ...props }) => (
  <a
    className={cn(
      s.root,
      {
        [s.button]: variant === 'button' || variant === 'buttonTransparent',
        [s.buttonTransparent]: variant === 'buttonTransparent',
        [s.link]: variant === 'link',
      },
      className,
    )}
    {...props}
  >
    {children}
  </a>
);
export default Link;
