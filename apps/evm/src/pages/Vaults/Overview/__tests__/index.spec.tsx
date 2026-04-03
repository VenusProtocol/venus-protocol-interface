import { screen } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { useGetTokenListUsdPrice } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
import { convertPriceMantissaToDollars, formatCentsToReadableValue } from 'utilities';
import { XVS_FIXED_PRICE_CENTS } from 'utilities/xvsPriceOnZk/constants';
import { Overview } from '..';

const fakeTokenPriceUsd = new BigNumber('5');

describe('Overview', () => {
  beforeEach(() => {
    (useGetTokenListUsdPrice as Mock).mockImplementation(() => ({
      data: fakeVaults.map(() => ({ tokenPriceUsd: fakeTokenPriceUsd })),
      isLoading: false,
    }));
  });

  it('uses oracle price for TVL calculation on non-zkSync chains', () => {
    renderComponent(<Overview vaults={fakeVaults} />);

    const expectedTvlCents = fakeVaults.reduce(
      (accu, vault) =>
        accu.plus(
          convertPriceMantissaToDollars({
            priceMantissa: vault.totalStakedMantissa?.times(fakeTokenPriceUsd),
            decimals: vault.stakedToken.decimals,
          }).shiftedBy(2),
        ),
      new BigNumber(0),
    );

    expect(screen.getByText(formatCentsToReadableValue({ value: expectedTvlCents }))).toBeTruthy();
  });

  it('uses fixed XVS price for XVS vault TVL on zkSync mainnet', () => {
    renderComponent(<Overview vaults={fakeVaults} />, {
      chainId: ChainId.ZKSYNC_MAINNET,
    });

    const xvsFixedUsd = new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2);

    const expectedTvlCents = fakeVaults.reduce((accu, vault) => {
      const isXvsVault = vault.stakedToken.symbol === 'XVS';
      const price = isXvsVault ? xvsFixedUsd : fakeTokenPriceUsd;

      return accu.plus(
        convertPriceMantissaToDollars({
          priceMantissa: vault.totalStakedMantissa?.times(price),
          decimals: vault.stakedToken.decimals,
        }).shiftedBy(2),
      );
    }, new BigNumber(0));

    expect(screen.getByText(formatCentsToReadableValue({ value: expectedTvlCents }))).toBeTruthy();
  });

  it('uses fixed XVS price for XVS vault TVL on zkSync sepolia', () => {
    renderComponent(<Overview vaults={fakeVaults} />, {
      chainId: ChainId.ZKSYNC_SEPOLIA,
    });

    const xvsFixedUsd = new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2);

    const expectedTvlCents = fakeVaults.reduce((accu, vault) => {
      const isXvsVault = vault.stakedToken.symbol === 'XVS';
      const price = isXvsVault ? xvsFixedUsd : fakeTokenPriceUsd;

      return accu.plus(
        convertPriceMantissaToDollars({
          priceMantissa: vault.totalStakedMantissa?.times(price),
          decimals: vault.stakedToken.decimals,
        }).shiftedBy(2),
      );
    }, new BigNumber(0));

    expect(screen.getByText(formatCentsToReadableValue({ value: expectedTvlCents }))).toBeTruthy();
  });
});
