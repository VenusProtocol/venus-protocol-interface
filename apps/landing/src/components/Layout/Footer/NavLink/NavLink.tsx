import { cn } from '@venusprotocol/ui';

export interface NavLink {
  text: string;
  href: string;
}

export interface NavLinkProps {
  links: NavLink[];
  className?: string;
}

export const NavLinkList: React.FC<NavLinkProps> = ({ links, className }) => (
  <div className="space-y-6 sm:flex sm:space-y-0 sm:gap-x-6">
    {links.map(({ href, text }) => (
      <a
        href={href}
        key={href}
        className={cn('block transition-colors hover:text-blue active:text-mediumBlue', className)}
      >
        {text}
      </a>
    ))}
  </div>
);
