import { fireEvent, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetSwapQuote, useRepayWithCollateral } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { renderComponent } from 'testUtils/render';
import { RepayWithCollateralForm } from '..';
import { fakeAsset, fakePool } from '../../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

// The global setup replaces this hook with the identity function, which hides the gap between the
// typed amount and the debounced one this test is about
vi.mock('hooks/useDebounceValue', async () => vi.importActual('hooks/useDebounceValue'));

vi.mock('hooks/useTokenApproval');

const fakeRepaidAsset = fakeAsset;
const fakeCollateralAsset = fakePool.assets[2];

describe('RepayWithCollateralForm debounced swap quote', () => {
  beforeEach(() => {
    (useUserChainSettings as Mock).mockReturnValue([
      {
        ...defaultUserChainSettings,
        doNotShowGatedAssetModal: true,
      },
      vi.fn(),
    ]);

    (useRepayWithCollateral as Mock).mockImplementation(() => ({
      mutateAsync: vi.fn(),
    }));

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      data: undefined,
    }));

    (useSimulatePoolMutations as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: fakePool,
      },
    }));
  });

  it('never requests a quote for a zero amount when filling the collateral input in one go', async () => {
    const { getByTestId, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeCollateralAsset.vToken.underlyingToken,
    });

    fireEvent.click(getByTestId(TEST_IDS.availableAmount).querySelector('button')!);

    await waitFor(() => {
      const [input, options] = (useGetSwapQuote as Mock).mock.calls.at(-1)!;
      expect(options.enabled).toBe(true);
      expect(input.fromTokenAmountTokens.isGreaterThan(0)).toBe(true);
    });

    const enabledZeroAmountCalls = (useGetSwapQuote as Mock).mock.calls.filter(
      ([input, options]) => {
        const amountTokens = input.fromTokenAmountTokens ?? input.minToTokenAmountTokens;

        return !!options?.enabled && !!amountTokens?.isLessThanOrEqualTo(0);
      },
    );

    expect(enabledZeroAmountCalls).toHaveLength(0);
  });
});
