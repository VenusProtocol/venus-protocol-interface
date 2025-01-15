import BigNumber from 'bignumber.js';
import { type Proposal, ProposalState } from 'types';
import { remoteProposals } from './remoteProposals';

export const proposals: Proposal[] = [
  {
    abstainedVotesMantissa: new BigNumber('0'),
    againstVotesMantissa: new BigNumber('0'),
    createdDate: new Date('2023-09-20T07:39:35.000Z'),
    description: {
      version: 'v1',
      title: 'VIP Comptroller Diamond proxy',
      description:
        'This vip implement diamond proxy for the comptroller to divide the comptroller logic into facets. The current implementation of the comptroller is exceeding the max limit of the contract size. To resolve this diamond proxy is implemented.',
    },
    endBlock: 33499859,
    endDate: new Date('2023-09-20T07:54:35.000Z'),
    queuedDate: new Date('2023-09-20T09:54:35.000Z'),
    executionEtaDate: new Date('2023-09-21T06:54:35.000Z'),
    executedDate: new Date('2023-09-21T07:54:35.000Z'),
    forVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalId: 98,
    proposerAddress: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
    startDate: new Date('2023-09-20T07:47:05.000Z'),
    state: ProposalState.Executed,
    createdTxHash: '0xb8a70919dbf83e5c63af8efbad418b2a81ca9f4937b12f806482581abaf03b65',
    totalVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalActions: [],
    forVotes: [
      {
        proposalId: 98,
        address: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
        support: 1,
        votesMantissa: new BigNumber('605461000000000000000000'),
        reason: '',
      },
    ],
    againstVotes: [],
    abstainVotes: [],
    proposalType: 0,
    remoteProposals,
  },
  {
    abstainedVotesMantissa: new BigNumber('500000000000000000000000'),
    againstVotesMantissa: new BigNumber('500000000000000000000000'),
    createdDate: new Date('2023-09-20T07:39:35.000Z'),
    description: {
      version: 'v1',
      title: 'VIP Comptroller Diamond proxy',
      description:
        'This vip implement diamond proxy for the comptroller to divide the comptroller logic into facets. The current implementation of the comptroller is exceeding the max limit of the contract size. To resolve this diamond proxy is implemented.',
    },
    endBlock: 33499859,
    endDate: new Date('2023-09-20T07:54:35.000Z'),
    forVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalId: 97,
    proposerAddress: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
    startDate: new Date('2023-09-20T07:47:05.000Z'),
    state: ProposalState.Active,
    createdTxHash: '0xb8a70919dbf83e5c63af8efbad418b2a81ca9f4937b12f806482581abaf03b65',
    totalVotesMantissa: new BigNumber('1.605461e+24'),
    proposalActions: [],
    forVotes: [
      {
        proposalId: 97,
        address: '0xc444949e0054a23c44fc45789738bdf64aed2391',
        support: 1,
        votesMantissa: new BigNumber('605461000000000000000000'),
        reason: 'yes',
      },
    ],
    againstVotes: [
      {
        proposalId: 97,
        address: '0x60277add339d936c4ab907376afee4f7ac17d760',
        support: 0,
        votesMantissa: new BigNumber('500000000000000000000000'),
        reason: 'no',
      },
    ],
    abstainVotes: [
      {
        proposalId: 97,
        address: '0xb98fa0292e2927018c03ad5110673b7daa1424a7',
        support: 2,
        votesMantissa: new BigNumber('500000000000000000000000'),
        reason: 'abstain',
      },
    ],
    proposalType: 0,
    remoteProposals,
  },
  {
    abstainedVotesMantissa: new BigNumber('0'),
    againstVotesMantissa: new BigNumber('0'),
    cancelDate: new Date('2023-09-19T15:46:26.000Z'),
    createdDate: new Date('2023-09-18T11:19:41.000Z'),
    description: {
      version: 'v1',
      title: 'VIP Comptroller Diamond proxy',
      description:
        'This vip implement diamond proxy for the comptroller to divide the comptroller logic into facets. The current implementation of the comptroller is exceeding the max limit of the contract size. To resolve this diamond proxy is implemented.',
    },
    endBlock: 33446667,
    endDate: new Date('2023-09-18T11:34:41.000Z'),
    forVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalId: 96,
    proposerAddress: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
    queuedDate: new Date('2023-09-19T07:49:29.000Z'),
    executionEtaDate: new Date('2023-09-19T07:59:29.000Z'),
    startDate: new Date('2023-09-18T11:27:11.000Z'),
    state: ProposalState.Canceled,
    createdTxHash: '0x67c11aa7e66f92063d8e0fbfa3f528ad3266dafb3d26a976e008da930fde8209',
    cancelTxHash: '0xec844bf514a6803c33ae93c168933d149ed16919a882f222a450b45f7895f86c',
    queuedTxHash: '0x7f288a72f9d53e35720f6eaed2c3ad344cb1e08944a554a26004aa73cd16800c',
    totalVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalActions: [],
    forVotes: [
      {
        proposalId: 96,
        address: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
        support: 1,
        votesMantissa: new BigNumber('605461000000000000000000'),
        reason: '',
      },
    ],
    againstVotes: [],
    abstainVotes: [],
    proposalType: 0,
    remoteProposals,
  },
  {
    abstainedVotesMantissa: new BigNumber('0'),
    againstVotesMantissa: new BigNumber('0'),
    createdDate: new Date('2023-09-15T10:08:20.000Z'),
    description: {
      version: 'v2',
      title: 'test',
      description: '1',
      forDescription: '1',
      againstDescription: '2',
      abstainDescription: '3',
    },
    endBlock: 33358842,
    endDate: new Date('2023-09-15T10:23:20.000Z'),
    forVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalId: 95,
    proposerAddress: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
    startDate: new Date('2023-09-15T10:15:50.000Z'),
    state: ProposalState.Defeated,
    createdTxHash: '0xfe924152536a7f775689c664aca3754c9694b78040c2ae7a0b56f84fed602acb',
    totalVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalActions: [],
    forVotes: [
      {
        proposalId: 95,
        address: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
        support: 1,
        votesMantissa: new BigNumber('605461000000000000000000'),
        reason: '',
      },
    ],
    againstVotes: [],
    abstainVotes: [],
    proposalType: 0,
    remoteProposals,
  },
  {
    abstainedVotesMantissa: new BigNumber('0'),
    againstVotesMantissa: new BigNumber('0'),
    createdDate: new Date('2023-09-14T19:25:15.000Z'),
    description: {
      version: 'v2',
      title: '123',
      description: 'Crit',
      forDescription: 'Yes',
      againstDescription: 'No',
      abstainDescription: 'Meh',
    },
    endBlock: 33340981,
    endDate: new Date('2023-09-14T19:30:15.000Z'),
    forVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalId: 94,
    proposerAddress: '0x6eace20e1f89d0b24e5b295af1802dfbc730b37d',
    startDate: new Date('2023-09-14T19:27:45.000Z'),
    state: ProposalState.Succeeded,
    createdTxHash: '0x27f1c81bfb014d08d2181af3bd9fa363b93a022e3f3c6798395e74b02f238a5f',
    totalVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalActions: [],
    forVotes: [
      {
        proposalId: 94,
        address: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
        support: 1,
        votesMantissa: new BigNumber('605461000000000000000000'),
        reason: '',
      },
    ],
    againstVotes: [],
    abstainVotes: [],
    proposalType: 0,
    remoteProposals,
  },
  {
    abstainedVotesMantissa: new BigNumber('0'),
    againstVotesMantissa: new BigNumber('0'),
    createdDate: new Date('2023-09-14T15:56:35.000Z'),
    description: {
      version: 'v2',
      title: '123',
      description: '123',
      forDescription: 'Ok',
      againstDescription: 'No',
      abstainDescription: 'Meh',
    },
    endBlock: 33337008,
    endDate: new Date('2023-09-14T16:11:35.000Z'),
    executionEtaDate: new Date('2023-12-14T16:11:35.000Z'),
    forVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalId: 93,
    proposerAddress: '0x6eace20e1f89d0b24e5b295af1802dfbc730b37d',
    startDate: new Date('2023-09-14T16:04:05.000Z'),
    state: ProposalState.Queued,
    createdTxHash: '0xd016993b6b81bfbc5e6070edd88106809ebb0b7b58e67d33b526d027c1f5f076',
    totalVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalActions: [],
    forVotes: [
      {
        proposalId: 93,
        address: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
        support: 1,
        votesMantissa: new BigNumber('605461000000000000000000'),
        reason: '',
      },
    ],
    againstVotes: [],
    abstainVotes: [],
    proposalType: 0,
    remoteProposals,
  },
  {
    abstainedVotesMantissa: new BigNumber('0'),
    againstVotesMantissa: new BigNumber('0'),
    createdDate: new Date('2023-09-14T15:56:35.000Z'),
    description: {
      version: 'v2',
      title: '123',
      description: '123',
      forDescription: 'Ok',
      againstDescription: 'No',
      abstainDescription: 'Meh',
    },
    endBlock: 33337008,
    endDate: new Date('2023-09-14T16:11:35.000Z'),
    forVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalId: 92,
    proposerAddress: '0x6eace20e1f89d0b24e5b295af1802dfbc730b37d',
    startDate: new Date('2023-09-14T16:04:05.000Z'),
    state: ProposalState.Queued,
    executionEtaDate: new Date('2023-09-14T16:11:35.000Z'),
    createdTxHash: '0xd016993b6b81bfbc5e6070edd88106809ebb0b7b58e67d33b526d027c1f5f076',
    totalVotesMantissa: new BigNumber('605461000000000000000000'),
    proposalActions: [],
    forVotes: [
      {
        proposalId: 92,
        address: '0x2ce1d0ffd7e869d9df33e28552b12ddded326706',
        support: 1,
        votesMantissa: new BigNumber('605461000000000000000000'),
        reason: '',
      },
    ],
    againstVotes: [],
    abstainVotes: [],
    proposalType: 0,
    remoteProposals,
  },
];
