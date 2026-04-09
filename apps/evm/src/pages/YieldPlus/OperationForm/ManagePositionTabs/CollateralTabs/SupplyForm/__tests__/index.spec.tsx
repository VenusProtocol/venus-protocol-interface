import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import {
  useGetProportionalCloseTolerancePercentage,
  useGetSimulatedPool,
  useSupplyYieldPlusPositionCollateral,
} from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { en } from 'libs/translations';
import { useGetYieldPlusAssets } from 'pages/YieldPlus/useGetYieldPlusAssets';
import { renderComponent } from 'testUtils/render';
import type { Asset, Pool } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { SupplyForm } from '..';

vi.mock('pages/YieldPlus/useGetYieldPlusAssets', () => ({
  useGetYieldPlusAssets: vi.fn(),
}));

const position = yieldPlusPositions[0];

const mockUseGetProportionalCloseTolerancePercentage =
  useGetProportionalCloseTolerancePercentage as Mock;
const mockUseGetSimulatedPool = useGetSimulatedPool as Mock;
const mockUseSupplyYieldPlusPositionCollateral = useSupplyYieldPlusPositionCollateral as Mock;
const mockUseGetContractAddress = useGetContractAddress as Mock;
const mockUseGetYieldPlusAssets = useGetYieldPlusAssets as Mock;
const mockSupplyYieldPlusPositionCollateral = vi.fn(async () => undefined);

const getDsaAmountInput = (container: HTMLElement) =>
  container.querySelector('input[name="dsaAmountTokens"]') as HTMLInputElement;

const setReadyState = ({
  simulatedPool = position.pool,
  dsaAssets = [position.dsaAsset],
}: {
  simulatedPool?: Pool;
  dsaAssets?: Asset[];
} = {}) => {
  mockUseGetProportionalCloseTolerancePercentage.mockImplementation(() => ({
    data: {
      proportionalCloseTolerancePercentage: 2,
    },
  }));

  mockUseGetSimulatedPool.mockImplementation(({ pool }: { pool: Pool }) => ({
    data: {
      pool: simulatedPool || pool,
    },
    isLoading: false,
  }));

  mockUseSupplyYieldPlusPositionCollateral.mockImplementation(() => ({
    mutateAsync: mockSupplyYieldPlusPositionCollateral,
    isPending: false,
  }));

  mockUseGetContractAddress.mockImplementation(() => ({
    address: position.positionAccountAddress,
  }));

  mockUseGetYieldPlusAssets.mockImplementation(() => ({
    data: {
      dsaAssets,
      supplyAssets: [],
      borrowAssets: [],
    },
    isLoading: false,
  }));
};

describe('SupplyForm', () => {
  beforeEach(() => {
    setReadyState();
  });

  it('renders form when data is ready', async () => {
    const { getByText, getAllByText } = renderComponent(<SupplyForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.supplyDsaForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    expect(getAllByText(en.yieldPlus.operationForm.openForm.dsaFieldLabel).length).toBeGreaterThan(
      0,
    );
  });

  it('requires wallet connection to interact with form fields', async () => {
    const { container, getByText } = renderComponent(<SupplyForm position={position} />);

    await waitFor(() => expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument());

    expect(getDsaAmountInput(container)).toBeDisabled();
  });

  it('fills the input with the wallet balance when clicking the balance shortcut', async () => {
    const { container, getByRole, getByText } = renderComponent(
      <SupplyForm position={position} />,
      {
        accountAddress: position.positionAccountAddress,
      },
    );

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.supplyDsaForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const readableWalletBalance = formatTokensToReadableValue({
      value: position.dsaAsset.userWalletBalanceTokens,
      token: position.dsaAsset.vToken.underlyingToken,
    });

    fireEvent.click(getByRole('button', { name: readableWalletBalance }));

    await waitFor(() =>
      expect(getDsaAmountInput(container).value).toBe(
        position.dsaAsset.userWalletBalanceTokens.toFixed(),
      ),
    );
  });

  it('submits supply request when form is valid', async () => {
    const expectedAmountMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber('1'),
        token: position.dsaAsset.vToken.underlyingToken,
      }).toFixed(),
    );

    const { container, getByText } = renderComponent(<SupplyForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.supplyDsaForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const dsaAmountInput = getDsaAmountInput(container);

    fireEvent.change(dsaAmountInput, {
      target: { value: '1' },
    });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSupplyYieldPlusPositionCollateral).toHaveBeenCalledTimes(1));

    expect(mockSupplyYieldPlusPositionCollateral).toHaveBeenCalledWith({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      amountMantissa: expectedAmountMantissa,
    });

    await waitFor(() => {
      expect(dsaAmountInput).toHaveValue(null);
    });
  });
});
