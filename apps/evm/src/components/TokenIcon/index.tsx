import { chains } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';

import type { Token } from 'types';

export interface TokenIconProps {
  token: Token;
  displayChain?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({
  className,
  token,
  displayChain = false,
  size = 'md',
}) => {
  const chain = chains[token.chainId];

  return (
    <div
      className={cn(
        'relative',
        displayChain && size === 'md' && 'size-8',
        displayChain && size === 'lg' && 'size-13',
        !displayChain && size === 'md' && 'size-5',
        !displayChain && size === 'lg' && 'size-6',
        className,
      )}
    >
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
