import { cn } from '@venusprotocol/ui';

import type { Token } from 'types';
import { TokenIcon, type TokenIconProps } from './TokenIcon';

export interface TokenPairProps {
  longToken: Token;
  shortToken: Token;
  size: TokenIconProps['size'];
  className?: string;
}

export const TokenPair: React.FC<TokenPairProps> = ({ longToken, shortToken, className, size }) => (
  <div className={cn('flex items-center gap-x-2', className)}>
    <div className="flex items-center -space-x-2">
      <TokenIcon token={longToken} size={size} />

      <TokenIcon token={shortToken} size={size} />
    </div>

    <p className={cn(size === 'sm' ? 'text-b1s' : 'text-p3s')}>
      {longToken.symbol}/{shortToken.symbol}
    </p>
  </div>
);
