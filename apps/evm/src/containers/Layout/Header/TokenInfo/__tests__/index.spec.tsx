import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { xvs } from '__mocks__/models/tokens';
import { vXvs } from '__mocks__/models/vTokens';
import { useAddTokenToWallet } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { TokenInfo, type TokenInfoProps } from '..';

vi.mock('hooks/responsive', async () => {
  const actual = await vi.importActual<typeof import('hooks/responsive')>('hooks/responsive');

  return {
    ...actual,
    useBreakpointUp: vi.fn(() => true),
  };
});

const addTokenToWalletMock = vi.fn();

const renderTokenInfo = (props?: Partial<TokenInfoProps>) =>
  renderComponent(
    <TokenInfo
      token={xvs}
      tokenPriceOracleAddress="0x3000000000000000000000000000000000000001"
      relatedTokens={[xvs, vXvs]}
      cells={[{ label: 'Price', value: '$1.23' }]}
      {...props}
    />,
    {
      accountAddress: '0x0000000000000000000000000000000000000001',
    },
  );

describe('TokenInfo', () => {
  beforeEach(() => {
    addTokenToWalletMock.mockClear();
    (useAddTokenToWallet as Mock).mockReturnValue({
      addTokenToWallet: addTokenToWalletMock,
    });
  });

  it('renders token symbol, price cell, related-token dropdown options, and oracle link', () => {
    renderTokenInfo();

    expect(screen.getAllByText('XVS')[0]).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('$1.23')).toBeInTheDocument();

    const oracleLink = screen.getByText('Resilient Oracle').closest('a');
    expect(oracleLink).toHaveAttribute(
      'href',
      expect.stringContaining('0x3000000000000000000000000000000000000001'),
    );

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(screen.getByText('Add token to wallet')).toBeInTheDocument();
    expect(screen.getAllByText('XVS')).toHaveLength(2);
    expect(screen.getByText('vXVS')).toBeInTheDocument();
  });

  it('add-token action calls the wallet utility', () => {
    renderTokenInfo();

    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getAllByText('XVS')[1]);

    expect(addTokenToWalletMock).toHaveBeenCalledWith(xvs);
  });

  it('contract dropdown links point to explorer URLs', () => {
    renderTokenInfo();

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(screen.getByText('Go to token contract')).toBeInTheDocument();
    expect(screen.getByText('vXVS').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining(vXvs.address),
    );
  });

  it('renders protection mode props passed through to the indicator', () => {
    renderTokenInfo({
      protectionModeIndicator: {
        tokenSupplyPriceCents: new BigNumber(100),
        tokenBorrowPriceCents: new BigNumber(101),
      },
    });

    expect(screen.getByText('Protected')).toBeInTheDocument();
  });
});
