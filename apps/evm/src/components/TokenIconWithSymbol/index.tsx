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

      <div>
        <p className={cn(displayChain && 'text-b1r')}>{token.symbol}</p>

        {displayChain && <p className="text-light-grey text-b2r">{chain.name}</p>}
      </div>
    </div>
  );
};
