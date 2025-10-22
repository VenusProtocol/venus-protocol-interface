import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { type ModalProps, Tabs } from 'components';
import AssetAccessor from 'containers/AssetAccessor';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { VToken } from 'types';
import BorrowForm from './BorrowForm';
import NativeTokenBalanceWrapper from './NativeTokenBalanceWrapper';
import RepayForm from './RepayForm';
import SupplyForm from './SupplyForm';
import WithdrawForm from './WithdrawForm';
import rocketIconSrc from './rocket.svg';

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

  const isLeveragedPositionsFeatureEnabled = useIsFeatureEnabled({
    name: 'leveragedPositions',
  });

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
  ];

  if (isLeveragedPositionsFeatureEnabled) {
    tabs.push({
      id: 'boost',
      title: (
        <div className="flex items-center gap-x-1">
          <img src={rocketIconSrc} className="size-4" alt={t('operationForm.boostTabAltText')} />

          <span className="text-[#65EEE0]">{t('operationForm.boostTabTitle')}</span>
        </div>
      ),
      content: <>Coming soon</>,
    });
  }

  tabs.push({
    id: 'repay',
    title: t('operationForm.repayTabTitle'),
    content: (
      <AssetAccessor vToken={vToken} poolComptrollerAddress={poolComptrollerAddress} action="repay">
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
  });

  return (
    <Tabs
      tabs={tabs}
      initialActiveTabId={initialActiveTabId}
      navType="searchParam"
      variant={isLeveragedPositionsFeatureEnabled ? 'secondary' : 'primary'}
      headerClassName={cn(isLeveragedPositionsFeatureEnabled && 'sm:gap-x-8 lg:gap-x-6')}
    />
  );
};
