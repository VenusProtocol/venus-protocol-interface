const TEST_IDS = {
  votingWallet: {
    votingWeightValue: 'vote-voting-wallet-voting-weight-value',
    totalLockedValue: 'vote-voting-wallet-total-locked-value',
    delegateYourVoting: 'vote-voting-wallet-delegate-your-voting',
    depositYourTokens: 'vote-voting-wallet-deposit-your-tokens',
  },
  governance: {
    governanceProposal: (id: string) => `vote-governance-governance-proposal-${id}`,
  },
};
export default TEST_IDS;
