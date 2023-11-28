import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { vLuna, vUst } from '__mocks__/models/vTokens';
import { renderHook } from 'testUtils/render';

import { useGetLegacyPool } from 'clients/api';
import { UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { useLunaUstWarning } from '..';
import { store } from '../store';

describe('useLunaUstWarning', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'lunaUstWarning',
    );
  });

  it('gets isLunaUstWarningModalOpen from the store', () => {
    store.setState({
      isModalOpen: true,
    });

    const { result } = renderHook(() => useLunaUstWarning());

    expect(result.current.isLunaUstWarningModalOpen).toBe(true);

    store.setState({
      isModalOpen: false,
    });

    expect(result.current.isLunaUstWarningModalOpen).toBe(false);
  });

  it('sets isLunaUstWarningModalOpen to true when calling openLunaUstWarningModal', () => {
    const { result } = renderHook(() => useLunaUstWarning());

    result.current.openLunaUstWarningModal();

    expect(result.current.isLunaUstWarningModalOpen).toBe(true);
  });

  it('sets isLunaUstWarningModalOpen to false when calling closeLunaUstWarningModal', () => {
    const { result } = renderHook(() => useLunaUstWarning());

    result.current.closeLunaUstWarningModal();

    expect(result.current.isLunaUstWarningModalOpen).toBe(false);
  });

  it('returns userHasLunaOrUstCollateralEnabled as false when lunaUst feature is disabled', () => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(() => false);

    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: {
          ...poolData[0],
          assets: [
            {
              ...poolData[0].assets[0],
              vToken: vLuna,
              isCollateralOfUser: true,
            },
          ],
        },
      },
      isLoading: false,
    }));

    const { result } = renderHook(() => useLunaUstWarning());

    expect(result.current.userHasLunaOrUstCollateralEnabled).toBe(false);
  });

  it('returns userHasLunaOrUstCollateralEnabled as true when LUNA is enabled as collateral', () => {
    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: {
          ...poolData[0],
          assets: [
            {
              ...poolData[0].assets[0],
              vToken: vLuna,
              isCollateralOfUser: true,
            },
          ],
        },
      },
      isLoading: false,
    }));

    const { result } = renderHook(() => useLunaUstWarning());

    expect(result.current.userHasLunaOrUstCollateralEnabled).toBe(true);
  });

  it('returns userHasLunaOrUstCollateralEnabled as true when UST is enabled as collateral', () => {
    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: {
          ...poolData[0],
          assets: [
            {
              ...poolData[0].assets[0],
              vToken: vUst,
              isCollateralOfUser: true,
            },
          ],
        },
      },
      isLoading: false,
    }));

    const { result } = renderHook(() => useLunaUstWarning());

    expect(result.current.userHasLunaOrUstCollateralEnabled).toBe(true);
  });

  it('returns userHasLunaOrUstCollateralEnabled as false when neither LUNA nor UST is enabled as collateral', () => {
    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: {
          ...poolData[0],
          assets: [],
        },
      },
      isLoading: false,
    }));

    const { result } = renderHook(() => useLunaUstWarning());

    expect(result.current.userHasLunaOrUstCollateralEnabled).toBe(false);
  });
});
