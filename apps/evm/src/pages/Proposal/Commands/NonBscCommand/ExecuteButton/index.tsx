import type { ChainId } from '@venusprotocol/chains';
import { useExecuteProposal } from 'clients/api';
import { Button } from 'components';
import type { ConnectWalletProps } from 'containers/ConnectWallet';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwitchChain } from 'containers/SwitchChain';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';

export interface ExecuteButtonProps extends Omit<ConnectWalletProps, 'onClick'> {
  remoteProposalChainId: ChainId;
  remoteProposalId: number;
}

export const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  remoteProposalChainId,
  remoteProposalId,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const { mutateAsync: executeProposal, isPending: isExecuteProposalLoading } =
    useExecuteProposal();

  const execute = async () => {
    try {
      await executeProposal({ proposalId: remoteProposalId, chainId: remoteProposalChainId });
    } catch (error) {
      handleError({ error });
    }
  };

  return (
    <ConnectWallet {...otherProps} analyticVariant="vote_non_bsc_command">
      <SwitchChain chainId={remoteProposalChainId}>
        <Button onClick={execute} className="w-full" disabled={isExecuteProposalLoading}>
          {t('voteProposalUi.command.actionButton.execute')}
        </Button>
      </SwitchChain>
    </ConnectWallet>
  );
};
