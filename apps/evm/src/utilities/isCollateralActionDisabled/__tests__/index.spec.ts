import type { TokenAction } from 'types';
import { isCollateralActionDisabled } from '..';

const disabledActions: TokenAction[] = ['withdraw', 'repay', 'supply', 'borrow', 'swapAndSupply'];

describe('isCollateralActionDisabled', () => {
  it('can enter market when the action is enabled', () =>
    expect(
      isCollateralActionDisabled({
        isCollateralOfUser: false,
        disabledTokenActions: [...disabledActions, 'exitMarket'],
      }),
    ).toBe(false));
  it('cannot enter market when the action is disabled', () =>
    expect(
      isCollateralActionDisabled({
        isCollateralOfUser: false,
        disabledTokenActions: [...disabledActions, 'enterMarket'],
      }),
    ).toBe(true));
  it('can exit market when the action is disabled', () =>
    expect(
      isCollateralActionDisabled({
        isCollateralOfUser: true,
        disabledTokenActions: [...disabledActions, 'enterMarket'],
      }),
    ).toBe(false));
  it('cannot exit market when the action is disabled', () =>
    expect(
      isCollateralActionDisabled({
        isCollateralOfUser: true,
        disabledTokenActions: [...disabledActions, 'exitMarket'],
      }),
    ).toBe(true));
});
