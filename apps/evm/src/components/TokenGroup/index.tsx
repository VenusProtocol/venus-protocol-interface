import { cn } from '@venusprotocol/ui';

import type { Token } from 'types';

import { TokenIcon } from '../TokenIcon';

export interface TokenGroupProps {
  tokens: Token[];
  removeDuplicates?: boolean;
  className?: string;
  limit?: number;
}

export const TokenGroup: React.FC<TokenGroupProps> = ({
  className,
  tokens,
  removeDuplicates,
  limit = 0,
}) => {
  const sanitizedTokens = removeDuplicates
    ? [...new Map(tokens.map(token => [token.address, token])).values()]
    : tokens;

  const filteredTokens = limit > 0 ? sanitizedTokens.slice(0, limit) : tokens;

  return (
    <div className={cn('flex items-center', className)}>
      {filteredTokens.map((token, index) => (
        <TokenIcon
          className={cn(index > 0 && '-ml-1')}
          token={token}
          key={`token-group-item-${token.address}`}
        />
      ))}

      {limit > 0 && sanitizedTokens.length > limit && (
        <span className="text-b1r text-white ml-2">+{sanitizedTokens.length - limit}</span>
      )}
    </div>
  );
};
