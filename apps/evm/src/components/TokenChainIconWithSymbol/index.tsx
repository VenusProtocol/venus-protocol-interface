import { cn } from '@venusprotocol/ui';
import type { Chain, Token } from 'types';

import { TokenIcon } from '../TokenIcon';

export interface TokenChainIconWithSymbolProps {
  token: Token;
  chain: Chain;
  className?: string;
  tokenIconClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const TokenChainIconWithSymbol: React.FC<TokenChainIconWithSymbolProps> = ({
  token,
  chain,
  className,
  tokenIconClassName,
  size = 'medium',
}) => {
  let sizeClassName = '';
  switch (size) {
    case 'xl':
      sizeClassName =
        'size-8 min-w-8 [&+img]:size-3 sm:size-13 sm:min-w-13 [&+img]:sm:size-5 [&+img]:sm:min-w-5';
      break;
    default:
      sizeClassName = 'size-8 min-w-8 [&+img]:size-3 [&+img]:min-w-3';
      break;
  }

  return token && chain ? (
    <div className={cn(className, 'flex items-center gap-2')}>
      <div className="relative">
        <TokenIcon token={token} className={cn(sizeClassName, tokenIconClassName)} />
        <img className={cn('absolute end-0 bottom-0 z-10')} src={chain.iconSrc} alt={chain.name} />
      </div>
      <div>
        <div className="">{token.symbol}</div>
        <div className="flex items-center gap-1 w-fit text-nowrap">
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
};
