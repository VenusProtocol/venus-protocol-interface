import { type ModalProps, Tabs } from 'components';
import AssetAccessor from 'containers/AssetAccessor';
import { useTranslation } from 'libs/translations';
import type { VToken } from 'types';

import type { Tab } from 'hooks/useTabs';
import type { Address } from 'viem';
import BorrowForm from './BorrowForm';
import NativeTokenBalanceWrapper from './NativeTokenBalanceWrapper';
import RepayForm from './RepayForm';
import SupplyForm from './SupplyForm';
import WithdrawForm from './WithdrawForm';

export interface OperationFormProps {
  vToken: VToken;
  poolComptrollerAddress: Address;
  initialActiveTabId?: string;
  onSubmitSuccess?: ModalProps['handleClose'];
}

export const OperationForm: React.FC<OperationFormProps> = ({
  onSubmitSuccess,
  vToken,
  poolComptrollerAddress,
  initialActiveTabId,
}) => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      id: 'supply',
      title: t('operationForm.supplyTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
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
      id: 'withdraw',
      title: t('operationForm.withdrawTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          action="withdraw"
        >
          {({ asset, pool }) => (
            <WithdrawForm asset={asset} pool={pool} onSubmitSuccess={onSubmitSuccess} />
          )}
        </AssetAccessor>
      ),
    },
    {
      id: 'borrow',
      title: t('operationForm.borrowTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
          action="borrow"
        >
          {({ asset, pool }) => (
            <BorrowForm asset={asset} pool={pool} onSubmitSuccess={onSubmitSuccess} />
          )}
        </AssetAccessor>
      ),
    },
    {
      id: 'repay',
      title: t('operationForm.repayTabTitle'),
      content: (
        <AssetAccessor
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
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

  return <Tabs tabs={tabs} initialActiveTabId={initialActiveTabId} navType="searchParam" />;
};
