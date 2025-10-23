import { cn } from '@venusprotocol/ui';
import { useGetTokens } from 'libs/tokens';
import type { ChainId, ProposalAction } from 'types';
import { generateExplorerUrl } from 'utilities';

import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import formatSignature from './formatSignature';
import getContractName from './getContractName';

export interface ReadableActionSignatureProps extends React.HTMLAttributes<HTMLDivElement> {
  action: ProposalAction;
  chainId: ChainId;
}

export const ReadableActionSignature: React.FC<ReadableActionSignatureProps> = ({
  className,
  action,
  chainId,
  ...otherProps
}) => {
  const tokens = useGetTokens();
  const vTokens = useGetVTokens();

  const contractName = getContractName({
    target: action.target,
    vTokens,
    tokens,
    chainId,
  });

  return (
    <div className={cn('[overflow-wrap:anywhere]', className)} {...otherProps}>
      <a
        href={generateExplorerUrl({
          hash: action.target,
          urlType: 'address',
          chainId,
        })}
        target="_blank"
        rel="noreferrer"
        className="text-green hover:text-green/50 transition-colors"
      >
        {contractName}
      </a>

      <span className="text-grey">{formatSignature(action)}</span>
    </div>
  );
};
