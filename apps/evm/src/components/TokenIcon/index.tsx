import { chains } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';

import type { Token } from 'types';

export interface TokenIconProps {
  token: Token;
  displayChain?: boolean;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ className, token, displayChain = false }) => {
  const chain = chains[token.chainId];

  return (
    <div className={cn('relative', displayChain ? 'size-8' : 'size-5', className)}>
      <img src={token.iconSrc} alt={token.symbol} className="w-full" />

      {displayChain && (
        <img
          src={chain.iconSrc}
          className="size-[37.5%] absolute bottom-0 right-0"
          alt={token.symbol}
        />
      )}
    </div>
  );
};
