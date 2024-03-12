import type { TokenAction } from 'types';

// TODO: add tests

export const isAssetDeprecated = ({
  disabledTokenActions,
}: {
  disabledTokenActions: TokenAction[];
}) => {
  let isSupplyActionDisabled = false;
  let isBorrowActionDisabled = false;

  disabledTokenActions.forEach(disabledTokenAction => {
    if (disabledTokenAction === 'borrow') {
      isBorrowActionDisabled = true;
    }

    if (disabledTokenAction === 'supply') {
      isSupplyActionDisabled = true;
    }
  });

  return isSupplyActionDisabled && isBorrowActionDisabled;
};
