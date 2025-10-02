import { cn } from '@venusprotocol/ui';
import type { Token } from 'types';

export interface TokenIconProps {
  token: Token;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ className, token }) => (
  <img src={token.iconSrc} alt={token.symbol} className={cn('h-6 w-6', className)} />
);
