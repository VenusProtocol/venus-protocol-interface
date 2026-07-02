import { fireEvent } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import {
  useClaimRewards,
  useGetAccountPerformanceHistory,
  useGetAddressDomainName,
  useGetPendingRewards,
  useGetPool,
  useGetPools,
  useGetTokenUsdPrice,
  useGetVaults,
} from 'clients/api';
import { BODY_PORTAL_ID } from 'constants/layout';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { useDisconnect } from 'wagmi';

import { testIds as accountOverviewTestIds } from 'containers/AccountOverview/testIds';
import { AccountModal } from '..';

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');

  return {
    ...actual,
    useDisconnect: vi.fn(),
  };
});

describe('AccountModal', () => {
  beforeEach(() => {
    const backdropPortal = document.createElement('div');
    backdropPortal.id = BODY_PORTAL_ID;
    document.body.appendChild(backdropPortal);

    (useDisconnect as Mock).mockReturnValue({
      disconnect: vi.fn(),
    });

    (useGetAddressDomainName as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    (useGetPool as Mock).mockReturnValue({
      data: undefined,
    });

    (useGetVaults as Mock).mockReturnValue({
      data: undefined,
    });

    (useGetTokenUsdPrice as Mock).mockReturnValue({
      data: undefined,
    });

    (useGetAccountPerformanceHistory as Mock).mockReturnValue({
      data: undefined,
      error: null,
      refetch: vi.fn(),
    });

    (useGetPools as Mock).mockReturnValue({
      data: undefined,
    });

    (useGetPendingRewards as Mock).mockReturnValue({
      data: undefined,
    });

    (useClaimRewards as Mock).mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    });
  });

  afterEach(() => {
    document.getElementById(BODY_PORTAL_ID)?.remove();
  });

  it('renders the connected account details, settings, and action links without the account overview graph', () => {
    const { container, queryByTestId } = renderComponent(
      <AccountModal address={fakeAccountAddress} isPrime isVip />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();
    expect(queryByTestId(accountOverviewTestIds.performanceChartPreview)).not.toBeInTheDocument();
  });

  it('only displays the VIP Telegram group link when isVip is truthy', () => {
    const vipTelegramGroupLabel = en.vipTelegramGroupButton.label;

    const { queryByRole, unmount } = renderComponent(
      <AccountModal address={fakeAccountAddress} isPrime={false} isVip={false} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(
      queryByRole('link', {
        name: vipTelegramGroupLabel,
      }),
    ).not.toBeInTheDocument();

    unmount();

    const { getByRole } = renderComponent(
      <AccountModal address={fakeAccountAddress} isPrime={false} isVip />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(
      getByRole('link', {
        name: vipTelegramGroupLabel,
      }),
    ).toBeInTheDocument();
  });

  it('disconnects the connected wallet when the disconnect button is clicked', () => {
    const disconnectMock = vi.fn();
    (useDisconnect as Mock).mockReturnValue({
      disconnect: disconnectMock,
    });

    const { getByRole } = renderComponent(
      <AccountModal address={fakeAccountAddress} isPrime={false} isVip={false} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    fireEvent.click(
      getByRole('button', {
        name: en.accountModal.disconnectButtonLabel,
      }),
    );

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it('renders the blur layer into the body backdrop portal and closes when the outside layer is clicked', () => {
    const onCloseMock = vi.fn();

    renderComponent(
      <AccountModal address={fakeAccountAddress} isPrime={false} isVip onClose={onCloseMock} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const backdropPortal = document.getElementById(BODY_PORTAL_ID);
    const backdropBlur = backdropPortal?.firstElementChild as HTMLDivElement | null;

    expect(document.body.textContent).toMatchSnapshot();
    expect(backdropPortal?.childElementCount).toBe(1);
    expect(backdropBlur).not.toBeNull();

    fireEvent.click(backdropBlur!);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
