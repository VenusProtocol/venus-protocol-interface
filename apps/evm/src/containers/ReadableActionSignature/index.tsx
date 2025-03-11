import { cn } from '@venusprotocol/ui';
import { useGetVTokens } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import type { ChainId, ProposalAction } from 'types';
import { generateExplorerUrl } from 'utilities';

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
  const { data: getVTokensData } = useGetVTokens();
  const tokens = useGetTokens();
  const vTokens = getVTokensData?.vTokens || [];

  const contractName = getContractName({
    target: action.target,
    vTokens,
    tokens,
    chainId,
  });

  return (
    <div className={cn('[overflow-wrap:anywhere] ', className)} {...otherProps}>
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
