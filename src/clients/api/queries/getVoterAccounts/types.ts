export interface GetVoterAccountsResponse {
  limit: number;
  offset: number;
  total: number;
  result: {
    address: string;
    createdAt: string;
    id: string;
    proposalsVoted: number;
    updatedAt: string;
    voteWeight: number;
    votes: string;
    votes2: string;
  }[];
}
