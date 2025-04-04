import fakeAccountAddress, { altAddress as fakeSpenderAddress } from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { queryClient } from 'clients/api';

import { renderHook } from 'testUtils/render';

import { ChainId } from '@venusprotocol/chains';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import type { Mock } from 'vitest';
import { useApproveToken } from '..';

vi.mock('hooks/useSendTransaction');

const fakeInput = {
  tokenAddress: xvs.address,
  spenderAddress: fakeSpenderAddress,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useApproveToken', () => {
  it('calls useSendTransaction with the correct parameters', () => {
    renderHook(() => useApproveToken(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toMatchSnapshot({
      abi: expect.any(Array),
    });

    onConfirmed({ input: fakeInput });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          tokenAddress: fakeInput.tokenAddress,
          spenderAddress: fakeInput.spenderAddress,
          accountAddress: fakeAccountAddress,
        },
      ],
    });
  });

  it('uses allowance when provided', () => {
    renderHook(() => useApproveToken(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const params = (useSendTransaction as Mock).mock.calls[0][0];

    expect(params.fn({ ...fakeInput, allowance: 1000n })).toMatchSnapshot({
      abi: expect.any(Array),
    });
  });
});
