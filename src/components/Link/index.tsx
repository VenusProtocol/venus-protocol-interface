/** @jsxImportSource @emotion/react */
import React from 'react';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export type LinkProps = (RRLinkProps | React.AnchorHTMLAttributes<HTMLAnchorElement>) & {
  className?: string;
};

export const Link: React.FC<LinkProps> = ({ className, children, ...otherProps }) => {
  const classes = twMerge('text-blue hover:underline', className);

  return 'to' in otherProps && otherProps.to ? (
    <RRLink className={classes} {...otherProps}>
      {children}
    </RRLink>
  ) : (
    <a className={classes} target="_blank" {...otherProps}>
      {children}
    </a>
  );
};
