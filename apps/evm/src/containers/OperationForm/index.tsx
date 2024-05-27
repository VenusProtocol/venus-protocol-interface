import { type ModalProps, type TabContent, Tabs } from 'components';
import AssetAccessor from 'containers/AssetAccessor';
import { useTranslation } from 'libs/translations';
import type { VToken } from 'types';

import BorrowForm from './BorrowForm';
import NativeTokenBalanceWrapper from './NativeTokenBalanceWrapper';
import RepayForm from './RepayForm';
import SupplyForm from './SupplyForm';
import WithdrawForm from './WithdrawForm';

export interface OperationFormProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  initialActiveTabIndex?: number;
  onSubmitSuccess?: ModalProps['handleClose'];
}

export const OperationForm: React.FC<OperationFormProps> = ({
  onSubmitSuccess,
  vToken,
  poolComptrollerAddress,
  initialActiveTabIndex = 0,
}) => {
  const { t } = useTranslation();

  const tabsContent: TabContent[] = [
    {
      title: t('operationForm.supplyTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationForm.supply.connectWalletMessage')}
          action="supply"
        >
          {({ asset, pool }) => (
            <NativeTokenBalanceWrapper asset={asset} pool={pool}>
              {({ asset, pool, userTokenWrappedBalanceMantissa }) => (
                <SupplyForm
                  asset={asset}
                  pool={pool}
                  userTokenWrappedBalanceMantissa={userTokenWrappedBalanceMantissa}
                  onSubmitSuccess={onSubmitSuccess}
                />
              )}
            </NativeTokenBalanceWrapper>
          )}
        </AssetAccessor>
      ),
    },
    {
      title: t('operationForm.withdrawTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationForm.withdraw.connectWalletMessage')}
          action="withdraw"
        >
          {({ asset, pool }) => (
            <WithdrawForm asset={asset} pool={pool} onSubmitSuccess={onSubmitSuccess} />
          )}
        </AssetAccessor>
      ),
    },
    {
      title: t('operationForm.borrowTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationForm.borrow.connectWalletMessage')}
          action="borrow"
        >
          {({ asset, pool }) => (
            <BorrowForm asset={asset} pool={pool} onSubmitSuccess={onSubmitSuccess} />
          )}
        </AssetAccessor>
      ),
    },
    {
      title: t('operationForm.repayTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          connectWalletMessage={t('operationForm.repay.connectWalletMessage')}
          action="repay"
        >
          {({ asset, pool }) => (
            <NativeTokenBalanceWrapper asset={asset} pool={pool}>
              {({ asset, pool, userTokenWrappedBalanceMantissa }) => (
                <RepayForm
                  asset={asset}
                  pool={pool}
                  userTokenWrappedBalanceMantissa={userTokenWrappedBalanceMantissa}
                  onSubmitSuccess={onSubmitSuccess}
                />
              )}
            </NativeTokenBalanceWrapper>
          )}
        </AssetAccessor>
      ),
    },
  ];

  return <Tabs tabsContent={tabsContent} initialActiveTabIndex={initialActiveTabIndex} />;
};
