import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

const governorBravoDelegateResponses: {
  proposals: Awaited<ReturnType<ContractTypeByName<'governorBravoDelegate'>['proposals']>>;
} = {
  proposals: {
    abstainVotes: BN.from('100000000000000000000000'),
    againstVotes: BN.from('300000000000000000000000'),
    canceled: false,
    endBlock: BN.from('20881794'),
    eta: BN.from('1657705706'),
    executed: false,
    forVotes: BN.from('301580371600000000000000'),
    id: BN.from('139'),
    proposer: '0x6eACe20E1F89D0B24e5B295Af1802dfBc730B37D',
    startBlock: BN.from('20881594'),
    proposalType: 0,
  } as Awaited<ReturnType<ContractTypeByName<'governorBravoDelegate'>['proposals']>>,
};

export default governorBravoDelegateResponses;
