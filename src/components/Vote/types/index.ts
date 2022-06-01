export interface Action {
  title: string;
}

enum ProposalState {
  pending = 'Pending',
  active = 'Active',
  succeeded = 'Succeeded',
  queued = 'Queued',
  executed = 'Executed',
  canceled = 'Canceled',
  defeated = 'Defeated',
  expired = 'Expired',
}

export interface ProposalInfo {
  id: string;
  description: string;
  actions: Action[];
  startTimestamp?: number;
  createdTimestamp?: number;
  queuedTimestamp?: number;
  executedTimestamp?: number;
  endTimestamp?: number;
  cancelTimestamp?: number;
  updatedAt?: number;
  state: ProposalState;
  proposer: string;
}
