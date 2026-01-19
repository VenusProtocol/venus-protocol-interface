import { cn } from '@venusprotocol/ui';
import type { Chain, Token } from 'types';

import { TokenIcon } from '../TokenIcon';

export interface TokenChainIconWithSymbolProps {
  token: Token;
  chain: Chain;
  className?: string;
  tokenIconClassName?: string;
}

export const TokenChainIconWithSymbol: React.FC<TokenChainIconWithSymbolProps> = ({
  token,
  chain,
  className,
  tokenIconClassName,
}) =>
  token && chain ? (
    <div className={cn(className, 'flex items-center gap-2')}>
      <div className="relative">
        <TokenIcon token={token} className={cn('mr-2 h-6 w-6', tokenIconClassName)} />
        <img
          className={cn('absolute size-3 sm:size-5 end-0 bottom-0 z-10')}
          src={chain.iconSrc}
          alt={chain.name}
        />
      </div>
      <div>
        <div className="">{token.symbol}</div>
        <div className="flex items-center gap-1">
          <div
            className={cn(
              'text-light-grey text-[12px] leading-[1.2] sm:text-[14px] sm:leading-normal mt-1 sm:mt-0',
            )}
          >
            {chain.name}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={cn(className, 'flex items-center gap-2')} />
  );
