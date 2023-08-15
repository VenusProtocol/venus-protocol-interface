import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

import { TOKENS } from 'constants/tokens';

import getXvsVaultPoolCount from '.';

const xvsTokenAddress = TOKENS.xvs.address;

describe('api/queries/getXvsVaultPoolCount', () => {
  test('returns the XVS vault pool length on success', async () => {
    const fakeOutput = BN.from('10');

    const poolLengthMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      poolLength: poolLengthMock,
    } as unknown as ContractTypeByName<'xvsVault'>;

    const response = await getXvsVaultPoolCount({
      xvsVaultContract: fakeContract,
    });

    expect(poolLengthMock).toHaveBeenCalledTimes(1);
    expect(poolLengthMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response).toEqual({
      poolCount: fakeOutput.toNumber(),
    });
  });
});
