import { Page, Tabs } from 'components';
import { useTranslation } from 'libs/translations';
import { EModeTable } from './EModeTable';
import { Header } from './Header';
import { HistoricalDominanceChart } from './HistoricalDominanceChart';
import { HistoricalLiquidityChart } from './HistoricalLiquidityChart';
import { HistoricalMarketChart } from './HistoricalMarketChart';
import { Liquidations } from './Liquidations';
import { MarketKpis } from './MarketKpis';
import { MarketsTable } from './MarketsTable';
import { Rates } from './Rates';
import { RiskParametersTable } from './RiskParametersTable';
import { TopWallets } from './TopWallets';
import { TransactionsVolume } from './TransactionsVolume';
import { WalletKpis } from './WalletKpis';

const Overview: React.FC = () => (
  <div className="flex flex-col gap-6 pb-12">
    <MarketKpis />
    <WalletKpis />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <HistoricalMarketChart metric="supply" />
      <HistoricalMarketChart metric="borrows" />
    </div>
    <HistoricalLiquidityChart />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <HistoricalDominanceChart metric="supply" />
      <HistoricalDominanceChart metric="borrows" />
    </div>
    <TopWallets />
    <TransactionsVolume />
  </div>
);

const Markets: React.FC = () => (
  <div className="flex flex-col gap-6 pb-12">
    <MarketsTable />
    <RiskParametersTable />
    <EModeTable />
    <TransactionsVolume />
  </div>
);

const Stats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Header />
      <Tabs
        className="mt-6"
        variant="tertiary"
        navType="searchParam"
        tabs={[
          { id: 'overview', title: t('statsPage.tabs.overview'), content: <Overview /> },
          { id: 'markets', title: t('statsPage.tabs.markets'), content: <Markets /> },
          { id: 'wallets', title: t('statsPage.tabs.wallets'), content: null },
          {
            id: 'liquidations',
            title: t('statsPage.tabs.liquidations'),
            content: <Liquidations />,
          },
          { id: 'rates', title: t('statsPage.tabs.rates'), content: <Rates /> },
        ]}
      />
    </Page>
  );
};

export default Stats;
