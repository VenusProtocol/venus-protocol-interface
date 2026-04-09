import { screen } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { useGetTokenListUsdPrice } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
import { formatCentsToReadableValue } from 'utilities';
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

    const expectedTvlCents = fakeVaults.reduce((accu, vault) => {
      return accu.plus(vault.totalStakedCents);
    }, new BigNumber(0));

    expect(screen.getByText(formatCentsToReadableValue({ value: expectedTvlCents }))).toBeTruthy();
  });

  it('uses fixed XVS price for XVS vault TVL on zkSync mainnet', () => {
    renderComponent(<Overview vaults={fakeVaults} />, {
      chainId: ChainId.ZKSYNC_MAINNET,
    });

    const expectedTvlCents = fakeVaults.reduce((accu, vault) => {
      return accu.plus(vault.totalStakedCents);
    }, new BigNumber(0));

    expect(screen.getByText(formatCentsToReadableValue({ value: expectedTvlCents }))).toBeTruthy();
  });

  it('uses fixed XVS price for XVS vault TVL on zkSync sepolia', () => {
    renderComponent(<Overview vaults={fakeVaults} />, {
      chainId: ChainId.ZKSYNC_SEPOLIA,
    });

    const expectedTvlCents = fakeVaults.reduce((accu, vault) => {
      return accu.plus(vault.totalStakedCents);
    }, new BigNumber(0));

    expect(screen.getByText(formatCentsToReadableValue({ value: expectedTvlCents }))).toBeTruthy();
  });
});
