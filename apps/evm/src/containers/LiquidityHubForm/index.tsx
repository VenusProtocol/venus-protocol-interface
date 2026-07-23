import { Tabs } from 'components';
import LiquidityHubAccessor from 'containers/LiquidityHubAccessor';
import type { Tab, TabNavType } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { VhToken } from 'types';
import { SupplyTabs } from './SupplyTabs';
import { WithdrawForm } from './WithdrawForm';

export interface LiquidityHubFormProps {
  vhToken: VhToken;
  initialActiveTabId?: string;
  onSubmitSuccess?: () => void;
  navType?: TabNavType;
}

export const LiquidityHubForm: React.FC<LiquidityHubFormProps> = ({
  onSubmitSuccess,
  vhToken,
  initialActiveTabId,
  navType,
}) => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      id: 'supply',
      title: t('liquidityHubForm.supplyTabTitle'),
      content: (
        <LiquidityHubAccessor vhToken={vhToken}>
          {({ liquidityHub }) => (
            <SupplyTabs liquidityHub={liquidityHub} onSubmitSuccess={onSubmitSuccess} />
          )}
        </LiquidityHubAccessor>
      ),
    },
    {
      id: 'withdraw',
      title: t('liquidityHubForm.withdrawTabTitle'),
      content: (
        <LiquidityHubAccessor vhToken={vhToken}>
          {({ liquidityHub }) => (
            <WithdrawForm liquidityHub={liquidityHub} onSubmitSuccess={onSubmitSuccess} />
          )}
        </LiquidityHubAccessor>
      ),
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      initialActiveTabId={initialActiveTabId}
      navType={navType}
      variant="secondary"
    />
  );
};
