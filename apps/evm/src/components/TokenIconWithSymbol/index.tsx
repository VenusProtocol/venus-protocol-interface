import { chains } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';

import { TokenIcon, type TokenIconProps } from '../TokenIcon';

export interface TokenIconWithSymbolProps extends TokenIconProps {
  tokenIconClassName?: string;
}

export const TokenIconWithSymbol: React.FC<TokenIconWithSymbolProps> = ({
  token,
  className,
  tokenIconClassName,
  displayChain = false,
  ...otherProps
}) => {
  const chain = chains[token.chainId];

  return (
    <div className={cn(className, 'flex items-center gap-x-2')}>
      <TokenIcon
        token={token}
        className={tokenIconClassName}
        displayChain={displayChain}
        {...otherProps}
      />

      <div className="space-y-1">
        <p className={cn(displayChain && 'text-sm leading-[1.2]')}>{token.symbol}</p>

        {displayChain && <p className="text-light-grey text-xs leading-[1.2]">{chain.name}</p>}
      </div>
    </div>
  );
};
