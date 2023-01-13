import { GovernorBravoDelegate } from 'types/contracts';

const governorBravoDelegateResponses: {
  proposals: Awaited<ReturnType<ReturnType<GovernorBravoDelegate['methods']['proposals']>['call']>>;
} = {
  proposals: {
    0: '139',
    1: '0x6eACe20E1F89D0B24e5B295Af1802dfBc730B37D',
    2: '1657705706',
    3: '20881594',
    4: '20881794',
    5: '301580371600000000000000',
    6: '300000000000000000000000',
    7: '100000000000000000000000',
    8: false,
    9: false,
    10: '0',
    abstainVotes: '100000000000000000000000',
    againstVotes: '300000000000000000000000',
    canceled: false,
    endBlock: '20881794',
    eta: '1657705706',
    executed: false,
    forVotes: '301580371600000000000000',
    id: '139',
    proposer: '0x6eACe20E1F89D0B24e5B295Af1802dfBc730B37D',
    startBlock: '20881594',
    proposalType: '0',
  },
};

export default governorBravoDelegateResponses;
