import BigNumber from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { vaults } from '__mocks__/models/vaults';
import type { GetPendleSwapQuoteOutput } from 'clients/api';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { PendleVault } from 'types';
import { VaultCategory, VaultManager, VaultStatus } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { Footer, type FooterProps } from '..';

const baseVault: PendleVault = {
  ...vaults[0],
  category: VaultCategory.YIELD_TOKENS,
  manager: VaultManager.Pendle,
  managerIcon: 'logoMobile',
  status: VaultStatus.Active,
  key: 'pendle-VAI-XVS-2026-06-25',
  stakingAprPercentage: 3.39809766,
  maturityDate: new Date('2026-06-25T00:00:00.000Z'),
  liquidityCents: new BigNumber('742673002'),
  asset: assetData[0],
  poolComptrollerContractAddress: '0x1111111111111111111111111111111111111111',
  poolName: 'Core Pool',
};

const baseProps: FooterProps = {
  vault: baseVault,
  actionMode: 'deposit',
  fromToken: baseVault.stakedToken,
  toToken: baseVault.rewardToken,
  userStakedTokens: new BigNumber(123),
  estDiffAmountReadable: '7 XVS',
};

const swapQuote: GetPendleSwapQuoteOutput = {
  estimatedReceivedTokensMantissa: new BigNumber('20000000000000000000'),
  feeCents: new BigNumber(1234),
  priceImpactPercentage: 1.2,
  pendleMarketAddress: '0x2222222222222222222222222222222222222222',
  contractCallParamsName: [],
  contractCallParams: [] as unknown as GetPendleSwapQuoteOutput['contractCallParams'],
  requiredApprovals: [],
};

const getRow = (getByText: (text: string) => HTMLElement, label: string) =>
  getByText(label).parentElement?.parentElement;

describe('Footer', () => {
  it('renders only the APR and maturity rows when the wallet is disconnected', () => {
    const { getByText, queryByText } = renderComponent(<Footer {...baseProps} />);

    expect(getByText(en.vault.modals.effectiveFixedApr)).toBeInTheDocument();
    expect(
      getByText(formatPercentageToReadableValue(baseVault.stakingAprPercentage)),
    ).toBeInTheDocument();
    expect(getByText(en.vault.modals.maturityDate)).toBeInTheDocument();
    expect(
      getByText(t('vault.modals.textualWithTime', { date: baseVault.maturityDate })),
    ).toBeInTheDocument();

    expect(queryByText(en.vault.modals.currentDeposited)).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.estYield)).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.convert)).not.toBeInTheDocument();
  });

  it('renders conversion details and connected account rows for deposits', () => {
    const { getByText } = renderComponent(
      <Footer
        {...baseProps}
        userSlippageTolerancePercentage={5}
        swapQuote={swapQuote}
        estDiffAmountReadable="7 XVS"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const currentDepositedRow = getRow(getByText, en.vault.modals.currentDeposited);
    const feeRow = getRow(getByText, en.vault.modals.pendleFee);
    const minReceivedRow = getRow(getByText, en.vault.modals.minReceived);
    const estReceivedRow = getRow(getByText, en.vault.modals.estReceived);
    const estYieldRow = getRow(getByText, en.vault.modals.estYield);

    expect(currentDepositedRow).toHaveTextContent(
      formatTokensToReadableValue({
        value: baseProps.userStakedTokens,
        token: baseVault.rewardToken,
      }),
    );

    expect(getByText(baseProps.fromToken.symbol)).toBeInTheDocument();
    expect(getByText(baseProps.toToken.symbol)).toBeInTheDocument();
    expect(feeRow).toHaveTextContent(
      formatCentsToReadableValue({
        value: swapQuote.feeCents,
      }),
    );
    expect(minReceivedRow).toHaveTextContent(
      convertMantissaToTokens({
        value: swapQuote.estimatedReceivedTokensMantissa.times(0.95),
        token: baseProps.toToken,
        returnInReadableFormat: true,
      }),
    );
    expect(estReceivedRow).toHaveTextContent(
      `≈ ${convertMantissaToTokens({
        value: swapQuote.estimatedReceivedTokensMantissa,
        token: baseProps.toToken,
        returnInReadableFormat: true,
      })}`,
    );
    expect(estYieldRow).toHaveTextContent('7 XVS');
    expect(getByText(en.vault.modals.effectiveFixedApr)).toBeInTheDocument();
  });

  it('renders penalty instead of APR on withdraw and hides conversion details without slippage', () => {
    const { getByText, queryByText } = renderComponent(
      <Footer {...baseProps} actionMode="withdraw" estDiffAmountReadable="3 XVS" />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const currentDepositedRow = getRow(getByText, en.vault.modals.currentDeposited);
    const estPenaltyRow = getRow(getByText, en.vault.modals.estPenalty);

    expect(currentDepositedRow).toHaveTextContent('123 XVS');
    expect(estPenaltyRow).toHaveTextContent('3 XVS');

    expect(queryByText(en.vault.modals.effectiveFixedApr)).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.convert)).not.toBeInTheDocument();
  });

  it('does not render conversion details for redeem at maturity even when slippage is provided', () => {
    const { getByText, queryByText } = renderComponent(
      <Footer
        {...baseProps}
        actionMode="redeemAtMaturity"
        userSlippageTolerancePercentage={5}
        swapQuote={swapQuote}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(getByText(en.vault.modals.currentDeposited)).toBeInTheDocument();
    expect(getByText(en.vault.modals.estPenalty)).toBeInTheDocument();
    expect(queryByText(en.vault.modals.convert)).not.toBeInTheDocument();
  });
});
