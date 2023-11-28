import React from 'react';

import { Token } from 'types';
import { cn } from 'utilities';

export interface TokenIconProps {
  token: Token;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ className, token }) => (
  <img src={token.asset} alt={token.symbol} className={cn('mt-[-2px] h-6 w-6', className)} />
);
