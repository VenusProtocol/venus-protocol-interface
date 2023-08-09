import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

import getProposalThreshold from '.';

describe('api/queries/getProposalThreshold', () => {
  test('returns proposal threshold on success', async () => {
    const fakeOutput = BN.from('1000');

    const proposalThresholdMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      proposalThreshold: proposalThresholdMock,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const response = await getProposalThreshold({
      governorBravoDelegateContract: fakeContract,
    });

    expect(proposalThresholdMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      thresholdWei: new BigNumber(fakeOutput.toString()),
    });
  });
});
