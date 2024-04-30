import BigNumber from 'bignumber.js';

import { NoticeError } from 'components';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';

import TEST_IDS from './testIds';
import type { FormError } from './useForm';

export interface NoticeProps {
  amount: string;
  asset: Asset;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({ amount, asset }) => {
  const { t } = useTranslation();

  const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(asset.tokenPriceCents);

  if (new BigNumber(amount).isGreaterThan(assetLiquidityTokens)) {
    // User is trying to withdraw more than available liquidities
    return (
      <NoticeError
        data-testid={TEST_IDS.notice}
        description={t('operationModal.borrow.aboveLiquidityWarning')}
      />
    );
  }

  return null;
};

export default Notice;
