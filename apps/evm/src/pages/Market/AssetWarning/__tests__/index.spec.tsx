import { fireEvent, waitFor } from '@testing-library/react';

import { poolData } from '__mocks__/models/pools';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Asset, Pool } from 'types';
import { scrollToElement } from 'utilities';

import AssetWarning from '..';
import TEST_IDS from '../testIds';

vi.mock('utilities', async () => {
  const actual = await vi.importActual<typeof import('utilities')>('utilities');

  return {
    ...actual,
    scrollToElement: vi.fn(),
  };
});

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[0];
const fakeModeGroup = fakePool.eModeGroups[2];
const mockScrollToElement = vi.mocked(scrollToElement);

const renderAssetWarning = ({
  asset = fakeAsset,
  pool = fakePool,
}: {
  asset?: Asset;
  pool?: Pool;
} = {}) =>
  renderComponent(<AssetWarning token={asset.vToken.underlyingToken} pool={pool} asset={asset} />);

describe('AssetWarning', () => {
  it('renders the core pool warning with actions when the asset is available in core', () => {
    const { container, getByRole } = renderAssetWarning();

    expect(container).toHaveTextContent(
      `Supplying ${fakeAsset.vToken.underlyingToken.symbol} to the Core Pool lets you borrow tokens from this pool exclusively.`,
    );
    expect(getByRole('button', { name: 'Show all markets' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'mode info' })).toBeInTheDocument();
  });

  it('opens the modal when clicking Show all markets', async () => {
    const { getByRole, getByTestId, queryByTestId, getByText } = renderAssetWarning();

    expect(queryByTestId(TEST_IDS.marketTable)).not.toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'Show all markets' }));

    await waitFor(() => expect(getByTestId(TEST_IDS.marketTable)).toBeInTheDocument());

    expect(
      getByText(en.assetWarning.modalTitle.replace('{{ poolName }}', fakePool.name)),
    ).toBeInTheDocument();
  });

  it('scrolls to mode info when clicking the mode info button', () => {
    const { getByRole } = renderAssetWarning();

    fireEvent.click(getByRole('button', { name: 'mode info' }));

    expect(mockScrollToElement).toHaveBeenCalledWith('mode-info');
  });

  it('renders the e-mode-only warning when the asset is unavailable in core but available in e-mode', () => {
    const asset: Asset = {
      ...fakeAsset,
      collateralFactor: 0,
      isBorrowable: false,
    };

    const { container, getByRole } = renderAssetWarning({ asset });

    expect(container).toHaveTextContent(
      `${asset.vToken.underlyingToken.symbol} is only available in E-mode.`,
    );
    expect(getByRole('button', { name: 'other assets' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'mode info' })).toBeInTheDocument();
  });

  it('renders the isolation-only warning when the asset is only available in isolation mode', () => {
    const isolatedAsset: Asset = {
      ...fakeAsset,
      vToken: fakePool.assets[1].vToken,
      collateralFactor: 0,
      isBorrowable: false,
    };
    const pool: Pool = {
      ...fakePool,
      eModeGroups: [fakeModeGroup],
    };

    const { container, getByRole } = renderAssetWarning({
      asset: isolatedAsset,
      pool,
    });

    expect(container).toHaveTextContent(
      `${isolatedAsset.vToken.underlyingToken.symbol} is only available in Isolation mode.`,
    );
    expect(getByRole('button', { name: 'other assets' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'mode info' })).toBeInTheDocument();
  });

  it('renders the combined e-mode and isolation warning when the asset is only available in those groups', () => {
    const combinedAsset: Asset = {
      ...fakeAsset,
      vToken: fakePool.assets[1].vToken,
      collateralFactor: 0,
      isBorrowable: false,
    };

    const { container } = renderAssetWarning({ asset: combinedAsset });

    expect(container).toHaveTextContent(
      `${combinedAsset.vToken.underlyingToken.symbol} is only available in E-mode and Isolation mode.`,
    );
  });

  it('does not render when the asset is unavailable in core and every mode group', () => {
    const asset: Asset = {
      ...fakeAsset,
      collateralFactor: 0,
      isBorrowable: false,
    };
    const pool: Pool = {
      ...fakePool,
      eModeGroups: [],
    };

    const { container } = renderAssetWarning({ asset, pool });

    expect(container).toBeEmptyDOMElement();
  });
});
