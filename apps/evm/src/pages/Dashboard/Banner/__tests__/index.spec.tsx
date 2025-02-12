import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { renderComponent } from 'testUtils/render';

import { useGetPrimeToken } from 'clients/api';
import { en } from 'libs/translations';

import { ChainId } from 'types';
import { Banner } from '..';

describe('Banner', () => {
  beforeEach(() => {
    (useGetPrimeToken as Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Banner />);
  });

  it('renders Unichain promotional banner when current chain ID is not Unichain', () => {
    renderComponent(<Banner />, {
      chainId: ChainId.BSC_TESTNET,
    });

    expect(screen.getByText(en.dashboard.unichainPromotionalBanner.description));
  });

  it.each([ChainId.UNICHAIN_MAINNET, ChainId.UNICHAIN_SEPOLIA])(
    'does not render Unichain promotional banner when current chain ID is %s',
    chainId => {
      renderComponent(<Banner />, {
        chainId,
      });

      expect(
        screen.queryByText(en.dashboard.unichainPromotionalBanner.description),
      ).not.toBeInTheDocument();
    },
  );
});
