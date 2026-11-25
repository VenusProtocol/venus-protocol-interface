import { Tabs } from 'components';
import LiquidityHubAccessor from 'containers/LiquidityHubAccessor';
import { SUB_TAB_PARAM_KEY, type Tab, type TabNavType } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useSearchParams } from 'react-router';
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
  const [searchParams] = useSearchParams();
  const subTabParamValue =
    navType === 'searchParam' ? searchParams.get(SUB_TAB_PARAM_KEY) ?? undefined : undefined;
  const initialSupplyTabId =
    subTabParamValue === 'wallet' || subTabParamValue === 'collateral'
      ? subTabParamValue
      : undefined;

  const tabs: Tab[] = [
    {
      id: 'supply',
      title: t('liquidityHubForm.supplyTabTitle'),
      content: (
        <LiquidityHubAccessor vhToken={vhToken}>
          {({ liquidityHub }) => (
            <SupplyTabs
              key={vhToken.address}
              liquidityHub={liquidityHub}
              initialActiveTabId={initialSupplyTabId}
              onSubmitSuccess={onSubmitSuccess}
            />
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
            <WithdrawForm
              key={vhToken.address}
              liquidityHub={liquidityHub}
              onSubmitSuccess={onSubmitSuccess}
            />
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
