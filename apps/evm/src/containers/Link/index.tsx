import { Link as RRLink, type LinkProps as RRLinkProps } from 'react-router-dom';

import { useFormatTo } from 'hooks/useFormatTo';
import { cn } from 'utilities';

export type LinkProps = (RRLinkProps | React.AnchorHTMLAttributes<HTMLAnchorElement>) & {
  className?: string;
};

export const Link: React.FC<LinkProps> = ({ className, children, ...otherProps }) => {
  const { formatTo } = useFormatTo();
  const formattedTo = 'to' in otherProps ? formatTo({ to: otherProps.to }) : undefined;

  const classes = cn('text-blue hover:underline', className);

  return formattedTo ? (
    <RRLink {...otherProps} className={classes} to={formattedTo}>
      {children}
    </RRLink>
  ) : (
    <a target="_blank" rel="noreferrer" {...otherProps} className={classes}>
      {children}
    </a>
  );
};
