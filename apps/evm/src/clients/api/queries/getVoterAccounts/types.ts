export interface GetVoterAccountsResponse {
  limit: number;
  page: number;
  total: number;
  result: {
    address: string;
    delegate: string | null;
    proposalsVoted: number;
    stakedVotesMantissa: string;
    votesMantissa: string;
  }[];
}
