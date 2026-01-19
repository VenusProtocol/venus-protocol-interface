import type { ChainId } from '@venusprotocol/chains';
import { Link as RRLink, type LinkProps as RRLinkProps } from 'react-router';

import { cn } from '@venusprotocol/ui';
import { useFormatTo } from 'hooks/useFormatTo';
import { forwardRef } from 'react';

export type LinkProps = (RRLinkProps | React.AnchorHTMLAttributes<HTMLAnchorElement>) & {
  chainId?: ChainId;
  className?: string;
  noStyle?: boolean;
};

export const Link: React.FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, noStyle, chainId, ...otherProps }, ref) => {
    const { formatTo } = useFormatTo();
    const formattedTo = 'to' in otherProps ? formatTo({ to: otherProps.to, chainId }) : undefined;

    const classes = cn(
      !noStyle &&
        'text-blue no-underline hover:underline hover:text-blue-hover active:text-blue-active decoration-current underline-offset-2 decoration-1 duration-250',
      className,
    );

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
