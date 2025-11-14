import { cn } from '@venusprotocol/ui';
import type { Token } from 'types';

import { TokenIcon } from '../TokenIcon';

export interface TokenIconWithSymbolProps {
  token: Token;
  className?: string;
  tokenIconClassName?: string;
}

export const TokenIconWithSymbol: React.FC<TokenIconWithSymbolProps> = ({
  token,
  className,
  tokenIconClassName,
}) => (
  <div className={cn(className, 'flex items-center')}>
    <TokenIcon token={token} className={cn('mr-2 h-6 w-6', tokenIconClassName)} />

    <div>{token.symbol}</div>
  </div>
);
