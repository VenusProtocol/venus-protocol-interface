import { useGetVTokens } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import type { FormValues } from 'pages/Governance/ProposalList/CreateProposalModal/proposalSchema';
import type { ProposalAction } from 'types';
import { cn, generateChainExplorerUrl } from 'utilities';

import formatSignature from './formatSignature';
import getContractName from './getContractName';

export interface ReadableActionSignatureProps extends React.HTMLAttributes<HTMLDivElement> {
  action: FormValues['actions'][number] | ProposalAction;
}

export const ReadableActionSignature: React.FC<ReadableActionSignatureProps> = ({
  className,
  action,
  ...otherProps
}) => {
  const { chainId } = useChainId();
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
        href={generateChainExplorerUrl({
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
