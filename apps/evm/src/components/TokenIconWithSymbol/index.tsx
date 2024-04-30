import type { Token } from 'types';
import { cn } from 'utilities';

import { TokenIcon } from '../TokenIcon';

export interface TokenIconWithSymbolProps {
  token: Token;
  className?: string;
}

export const TokenIconWithSymbol: React.FC<TokenIconWithSymbolProps> = ({ token, className }) => (
  <div className={cn(className, 'flex items-center')}>
    <TokenIcon token={token} className="mr-2 h-6 w-6" />

    <div>{token.symbol}</div>
  </div>
);
