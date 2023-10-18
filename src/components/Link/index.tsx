/** @jsxImportSource @emotion/react */
import * as React from 'react';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import { cn } from 'utilities';

export type LinkProps = (RRLinkProps | React.AnchorHTMLAttributes<HTMLAnchorElement>) & {
  className?: string;
};

export const Link: React.FC<LinkProps> = ({ className, children, ...otherProps }) => {
  const classes = cn('text-blue hover:underline', className);

  return 'to' in otherProps && otherProps.to ? (
    <RRLink className={classes} {...otherProps}>
      {children}
    </RRLink>
  ) : (
    <a className={classes} target="_blank" rel="noreferrer" {...otherProps}>
      {children}
    </a>
  );
};
