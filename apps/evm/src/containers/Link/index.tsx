import { Link as RRLink, type LinkProps as RRLinkProps } from 'react-router-dom';

import { cn } from '@venusprotocol/ui';
import { useFormatTo } from 'hooks/useFormatTo';
import { forwardRef } from 'react';

export type LinkProps = (RRLinkProps | React.AnchorHTMLAttributes<HTMLAnchorElement>) & {
  className?: string;
};

export const Link: React.FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...otherProps }, ref) => {
    const { formatTo } = useFormatTo();
    const formattedTo = 'to' in otherProps ? formatTo({ to: otherProps.to }) : undefined;

    const classes = cn('text-blue hover:underline', className);

    return formattedTo ? (
      <RRLink {...otherProps} className={classes} to={formattedTo} ref={ref}>
        {children}
      </RRLink>
    ) : (
      <a target="_blank" rel="noreferrer" {...otherProps} className={classes} ref={ref}>
        {children}
      </a>
    );
  },
);
