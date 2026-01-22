import { chains } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';

import { TokenIcon, type TokenIconProps } from '../TokenIcon';

export interface TokenIconWithSymbolProps extends TokenIconProps {
  tokenIconClassName?: string;
}

export const TokenIconWithSymbol: React.FC<TokenIconWithSymbolProps> = ({
  token,
  className,
  displayChain = false,
  size = 'md',
  ...otherProps
}) => {
  const chain = chains[token.chainId];

  return (
    <div className={cn('flex items-center gap-x-3', className)}>
      <TokenIcon token={token} displayChain={displayChain} size={size} {...otherProps} />

      <div>
        <p
          className={cn(
            displayChain && size === 'md' && 'text-b1r',
            displayChain && size === 'lg' && 'text-p1s',
          )}
        >
          {token.symbol}
        </p>

        {displayChain && (
          <p className={cn('text-light-grey', size === 'md' ? 'text-b2r' : 'text-b1r')}>
            {chain.name}
          </p>
        )}
      </div>
    </div>
  );
};
