/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { NoticeError } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import TEST_IDS from './testIds';

export interface NoticeProps {
  amount: BigNumber;
  asset: Asset;
}

const Notice: React.FC<NoticeProps> = ({ amount, asset }) => {
  const { t } = useTranslation();
  const styles = useSharedStyles();

  const wouldSupplyAboveCap = useMemo(() => {
    if (!asset.supplyCapTokens) {
      return false;
    }

    return asset.userSupplyBalanceTokens.plus(amount).isGreaterThan(asset.supplyCapTokens);
  }, [amount, asset.supplyCapTokens]);

  if (wouldSupplyAboveCap) {
    // User is trying to borrow above their safe limit (allowed but puts them at
    // risk of liquidation)
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.noticeError}
        description={t('supplyWithdraw.supply.amountAboveSupplyCapWarning', {
          supplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  return null;
};

export default Notice;
