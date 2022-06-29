import useGetLatestProposalByProposer from './useGetLatestProposalIdByProposer';
import useGetProposalState from './useGetProposalState';

const useHasActiveProposal = ({ accountAddress }: { accountAddress: string }) => {
  const { data: proposalId } = useGetLatestProposalByProposer({ accountAddress });
  const { data: proposalState } = useGetProposalState(
    { proposalId: proposalId || '' },
    { enabled: !!proposalId && proposalId !== '0' },
  );
  return proposalState === '0' || proposalState === '1';
};

export default useHasActiveProposal;
