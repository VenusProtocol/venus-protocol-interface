import { Page, Wrapper } from 'components';
import { useState } from 'react';
import { Hero } from './Hero';
import { MarketExplorer } from './MarketExplorer';
import { ProtocolTotals } from './ProtocolTotals';
import { TokenPlanets } from './TokenPlanets';
import './lite.css';
import type { LiteEarnAsset } from './types';
import { useEarnAssets } from './useEarnAssets';

const Lite: React.FC = () => {
  const { earnAssets, categories, isLoading, isReady } = useEarnAssets();
  const [selectedEarnAsset, setSelectedEarnAsset] = useState<LiteEarnAsset>();

  return (
    <Page>
      <div className="lite-page relative flex min-h-0 grow flex-col">
        <TokenPlanets earnAssets={earnAssets} onSelect={setSelectedEarnAsset} />

        <Wrapper className="flex w-full min-h-0 max-w-[1440px] grow flex-col gap-3 py-2 sm:px-6">
          <Hero />

          <div className="flex min-h-0 grow flex-col items-center gap-3">
            <ProtocolTotals earnAssets={earnAssets} isReady={isReady} />

            <div className="flex w-full min-h-0 max-w-192 grow flex-col">
              <MarketExplorer
                earnAssets={earnAssets}
                categories={categories}
                isEarnLoading={isLoading}
                isEarnReady={isReady}
                selectedEarnAsset={selectedEarnAsset}
                onSelectEarnAsset={setSelectedEarnAsset}
              />
            </div>
          </div>
        </Wrapper>
      </div>
    </Page>
  );
};

export default Lite;
