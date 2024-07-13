import cn from 'classnames';
import type { ReactNode } from 'react';
import s from './Link.module.css';

interface ILinkProps {
  className?: string;
  href: string;
  children: ReactNode;
  variant?: 'button' | 'buttonTransparent' | 'link';
}

const Link: React.FC<ILinkProps> = ({ className, href, children, variant = 'button' }) => (
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
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </a>
);
export default Link;
