import { type TabContent, Tabs } from 'components';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';

import BorrowForm from 'hooks/useOperationModal/Modal/BorrowForm';
import NativeTokenBalanceWrapper from 'hooks/useOperationModal/Modal/NativeTokenBalanceWrapper';
import RepayForm from 'hooks/useOperationModal/Modal/RepayForm';
import SupplyForm from 'hooks/useOperationModal/Modal/SupplyForm';
import WithdrawForm from 'hooks/useOperationModal/Modal/WithdrawForm';

export interface OperationFormProps {
  pool: Pool;
  asset: Asset;
}

export const OperationForm: React.FC<OperationFormProps> = ({ pool, asset }) => {
  const { t } = useTranslation();

  const tabsContent: TabContent[] = [
    {
      title: t('market.operationForm.supplyTabTitle'),
      content: (
        <NativeTokenBalanceWrapper asset={asset} pool={pool}>
          {({ asset, pool, userWalletNativeTokenBalanceData }) => (
            <SupplyForm
              asset={asset}
              pool={pool}
              userWalletNativeTokenBalanceData={userWalletNativeTokenBalanceData}
            />
          )}
        </NativeTokenBalanceWrapper>
      ),
    },
    {
      title: t('market.operationForm.withdrawTabTitle'),
      content: <WithdrawForm asset={asset} pool={pool} />,
    },
    {
      title: t('market.operationForm.borrowTabTitle'),
      content: <BorrowForm asset={asset} pool={pool} />,
    },
    {
      title: t('market.operationForm.repayTabTitle'),
      content: (
        <NativeTokenBalanceWrapper asset={asset} pool={pool}>
          {({ asset, pool, userWalletNativeTokenBalanceData }) => (
            <RepayForm
              asset={asset}
              pool={pool}
              userWalletNativeTokenBalanceData={userWalletNativeTokenBalanceData}
            />
          )}
        </NativeTokenBalanceWrapper>
      ),
    },
  ];

  return <Tabs tabsContent={tabsContent} />;
};
