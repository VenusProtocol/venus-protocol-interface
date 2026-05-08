import { cn } from '@venusprotocol/ui';

import { TokenIcon as TokenIconComp, type TokenIconProps as TokenIconCompProps } from 'components';

export interface TokenIconProps extends Pick<TokenIconCompProps, 'token' | 'className'> {
  size: 'sm' | 'md';
}

export const TokenIcon: React.FC<TokenIconProps> = ({ className, size, ...otherProps }) => (
  <TokenIconComp
    className={cn('size-5', size === 'md' && 'md:size-8', className)}
    {...otherProps}
  />
);
