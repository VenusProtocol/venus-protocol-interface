import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { bnb, busd, usdc, usdt, vai, xvs } from '__mocks__/models/tokens';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Token } from 'types';
import { type OptionalTokenBalance, TokenListWrapper } from '..';
import { getTokenListItemTestId } from '../getTokenListItemTestId';

const testId = 'token-list-wrapper';
const mockOnTokenClick = vi.fn();
const mockOnClose = vi.fn();
const mockSetUserChainSettings = vi.fn();

const getTokenBalanceMantissa = (token: Token) => new BigNumber(10).pow(token.decimals);

const makeTokenBalance = (
  token: Token,
  overrides: Partial<OptionalTokenBalance> = {},
): OptionalTokenBalance => ({
  token,
  ...overrides,
});

const baseTokenBalances: OptionalTokenBalance[] = [
  makeTokenBalance(xvs, { balanceMantissa: getTokenBalanceMantissa(xvs) }),
  makeTokenBalance(bnb, { balanceMantissa: getTokenBalanceMantissa(bnb) }),
  makeTokenBalance(usdt, { balanceMantissa: getTokenBalanceMantissa(usdt) }),
  makeTokenBalance(busd),
  makeTokenBalance(usdc, { balanceMantissa: new BigNumber(0) }),
  makeTokenBalance(vai),
];

const renderTokenListWrapper = ({
  tokenBalances = baseTokenBalances,
  selectedToken = xvs,
  displayCommonTokenButtons = true,
}: {
  tokenBalances?: OptionalTokenBalance[];
  selectedToken?: Token;
  displayCommonTokenButtons?: boolean;
} = {}) =>
  renderComponent(
    <TokenListWrapper
      tokenBalances={tokenBalances}
      onTokenClick={mockOnTokenClick}
      onClose={mockOnClose}
      isListShown
      selectedToken={selectedToken}
      displayCommonTokenButtons={displayCommonTokenButtons}
      data-testid={testId}
    >
      <div>Trigger</div>
    </TokenListWrapper>,
  );

describe('TokenListWrapper', () => {
  beforeEach(() => {
    (useUserChainSettings as Mock).mockReturnValue([
      defaultUserChainSettings,
      mockSetUserChainSettings,
    ]);
  });

  it('sorts tokens with a positive balance ahead of tokens with zero or no balance', () => {
    const { container } = renderTokenListWrapper({
      tokenBalances: [
        makeTokenBalance(busd),
        makeTokenBalance(xvs, { balanceMantissa: getTokenBalanceMantissa(xvs) }),
        makeTokenBalance(usdc, { balanceMantissa: new BigNumber(0) }),
        makeTokenBalance(bnb, { balanceMantissa: getTokenBalanceMantissa(bnb) }),
      ],
    });

    const tokenItems = Array.from(
      container.querySelectorAll(`[data-testid^="${testId}-token-select-button-"]`),
    );

    expect(tokenItems[0]).toHaveTextContent(xvs.symbol);
    expect(tokenItems[1]).toHaveTextContent(bnb.symbol);
    expect(tokenItems[2]).toHaveTextContent(busd.symbol);
    expect(tokenItems[3]).toHaveTextContent(usdc.symbol);
  });

  it('filters tokens by symbol and address', () => {
    renderTokenListWrapper({
      displayCommonTokenButtons: false,
    });

    const searchInput = screen.getByPlaceholderText(
      en.selectTokenTextField.searchInput.placeholder,
    );

    fireEvent.change(searchInput, {
      target: {
        value: 'xv',
      },
    });

    expect(
      screen.getByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: xvs.address,
        }),
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: busd.address,
        }),
      ),
    ).not.toBeInTheDocument();

    fireEvent.change(searchInput, {
      target: {
        value: busd.address.toLowerCase().slice(2, 10),
      },
    });

    expect(
      screen.getByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: busd.address,
        }),
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: xvs.address,
        }),
      ),
    ).not.toBeInTheDocument();
  });

  it('selects an allowed token, clears the search input and closes the list', async () => {
    renderTokenListWrapper({
      displayCommonTokenButtons: false,
    });

    const searchInput = screen.getByPlaceholderText(
      en.selectTokenTextField.searchInput.placeholder,
    ) as HTMLInputElement;

    fireEvent.change(searchInput, {
      target: {
        value: 'busd',
      },
    });

    fireEvent.click(
      screen.getByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: busd.address,
        }),
      ),
    );

    await waitFor(() => expect(mockOnTokenClick).toHaveBeenCalledWith(busd));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(searchInput.value).toBe('');
  });

  it('shows the gated asset notice instead of selecting a gated token when the notice is not acknowledged', async () => {
    renderTokenListWrapper({
      tokenBalances: [makeTokenBalance(busd, { isGated: true })],
    });

    fireEvent.click(
      screen.getByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: busd.address,
        }),
      ),
    );

    expect(mockOnTokenClick).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(await screen.findByText(en.gatedAssetAcknowledgementModal.title)).toBeInTheDocument();
  });

  it('selects a gated token after the user accepts the notice', async () => {
    renderTokenListWrapper({
      tokenBalances: [makeTokenBalance(busd, { isGated: true })],
    });

    fireEvent.click(
      screen.getByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: busd.address,
        }),
      ),
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: en.gatedAssetAcknowledgementModal.acceptButtonLabel,
      }),
    );

    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      doNotShowGatedAssetModal: true,
    });
  });

  it('clears the pending selection when the user rejects the gated notice', async () => {
    renderTokenListWrapper({
      tokenBalances: [makeTokenBalance(busd, { isGated: true })],
    });

    fireEvent.click(
      screen.getByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: busd.address,
        }),
      ),
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: en.gatedAssetAcknowledgementModal.rejectButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).not.toBeInTheDocument(),
    );

    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      doNotShowGatedAssetModal: false,
    });
    expect(mockOnTokenClick).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('selects a gated token immediately when the gated asset notice has already been acknowledged', async () => {
    (useUserChainSettings as Mock).mockReturnValue([
      {
        ...defaultUserChainSettings,
        doNotShowGatedAssetModal: true,
      },
      mockSetUserChainSettings,
    ]);

    renderTokenListWrapper({
      tokenBalances: [makeTokenBalance(busd, { isGated: true })],
    });

    fireEvent.click(
      screen.getByTestId(
        getTokenListItemTestId({
          parentTestId: testId,
          tokenAddress: busd.address,
        }),
      ),
    );

    await waitFor(() => expect(mockOnTokenClick).toHaveBeenCalledWith(busd));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).not.toBeInTheDocument();
  });
});
