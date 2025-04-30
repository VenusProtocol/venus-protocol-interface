import fakeAccountAddress, { altAddress as fakeDelegateAddress } from '__mocks__/models/address';
import { queryClient } from 'clients/api';

import fakePoolComptrollerAddress, {
  altAddress as fakeDelegateeAddress,
} from '__mocks__/models/address';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useUpdatePoolDelegateStatus } from '..';

describe('useUpdatePoolDelegateStatus', () => {
  it('calls useSendTransaction with the correct parameters', () => {
    renderHook(() => useUpdatePoolDelegateStatus(), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    const input = {
      approvedStatus: true,
      poolComptrollerAddress: fakePoolComptrollerAddress,
      delegateeAddress: fakeDelegateeAddress,
    };

    expect(fn(input)).toMatchSnapshot({
      abi: expect.any(Array),
    });

    onConfirmed({ input });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS,
        {
          delegateeAddress: fakeDelegateAddress,
          accountAddress: fakeAccountAddress,
          poolComptrollerAddress: fakeAccountAddress,
        },
      ],
    });
  });
});
