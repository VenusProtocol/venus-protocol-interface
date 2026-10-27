import { Page, Wrapper } from 'components';
import { useState } from 'react';
import { Hero } from './Hero';
import { MarketExplorer } from './MarketExplorer';
import type { MarketMode } from './MarketExplorer/ModeSwitch';
import { ProtocolTotals } from './ProtocolTotals';
import { TokenPlanets } from './TokenPlanets';
import './lite.css';
import { useEarnAssets } from './useEarnAssets';

const Lite: React.FC = () => {
  const { earnAssets, categories, isLoading, isReady } = useEarnAssets();
  const [mode, setMode] = useState<MarketMode>('earn');
  const [selectedEarnAssetKey, setSelectedEarnAssetKey] = useState<string>();
  // Remounts the explorer so a planet pick drops whatever market was open
  const [explorerKey, setExplorerKey] = useState(0);

  const selectEarnAssetKey = (key: string | undefined) => {
    setSelectedEarnAssetKey(key);
    setMode('earn');
    setExplorerKey(current => current + 1);
  };

  return (
    <Page>
      <div className="lite-page relative flex min-h-0 grow flex-col">
        <TokenPlanets
          earnAssets={earnAssets}
          onSelect={earnAsset => selectEarnAssetKey(earnAsset.key)}
        />

        <Wrapper className="flex w-full min-h-0 max-w-[1440px] grow flex-col gap-3 py-2 sm:px-6">
          <Hero />

          <div className="flex min-h-0 grow flex-col items-center gap-3">
            <ProtocolTotals earnAssets={earnAssets} isReady={isReady} />

            <div className="flex w-full min-h-0 max-w-192 grow flex-col">
              <MarketExplorer
                key={explorerKey}
                earnAssets={earnAssets}
                categories={categories}
                isEarnLoading={isLoading}
                isEarnReady={isReady}
                mode={mode}
                onModeChange={setMode}
                selectedEarnAssetKey={selectedEarnAssetKey}
                onSelectEarnAssetKey={setSelectedEarnAssetKey}
              />
            </div>
          </div>
        </Wrapper>
      </div>
    </Page>
  );
};

export default Lite;
