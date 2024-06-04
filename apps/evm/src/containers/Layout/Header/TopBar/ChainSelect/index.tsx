import { Select, type SelectOption } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';
import { cn } from 'utilities';
import { useIsOnMarketPage } from '../../useIsOnMarketPage';

export interface ChainSelectProps {
  className?: string;
  buttonClassName?: string;
}

const options: SelectOption<ChainId>[] = chains.map(chain => {
  const metadata = CHAIN_METADATA[chain.id as ChainId];

  return {
    label: ({ isRenderedInButton }) => (
      <div className="flex items-center">
        <img src={metadata.logoSrc} alt={metadata.name} className="w-5 max-w-none flex-none" />

        {!isRenderedInButton && (
          <span className={cn('ml-2 grow overflow-hidden text-ellipsis')}>{metadata.name}</span>
        )}
      </div>
    ),
    value: chain.id,
  };
});

export const ChainSelect: React.FC<ChainSelectProps> = ({ className, buttonClassName }) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { switchChain } = useSwitchChain();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });
  const isOnMarketPage = useIsOnMarketPage();
  const shouldUseNewMarketFeature = isNewMarketPageEnabled && isOnMarketPage;

  return (
    <Select
      value={chainId}
      onChange={newChainId => switchChain({ chainId: Number(newChainId) })}
      options={options}
      menuPosition="right"
      variant={shouldUseNewMarketFeature ? 'tertiary' : 'primary'}
      menuTitle={t('layout.chainSelect.label')}
      buttonClassName={buttonClassName}
      className={className}
    />
  );
};
