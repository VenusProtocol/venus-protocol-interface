import { chains as chainMetadata } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';
import { Select, type SelectOption, type SelectProps } from 'components';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';
import { isSunsetChain } from 'utilities/isSunsetChain';
import { GaslessStatus } from './GaslessStatus';
import { SunsetIndicator, SunsetModal } from './SunsetIndicator';
import { useSunsetModalStore } from './sunsetModalStore';

export interface ChainSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'options' | 'optionClassName'> {
  buttonClassName?: string;
}

export const ChainSelect: React.FC<ChainSelectProps> = props => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { switchChain } = useSwitchChain();
  const openSunsetModal = useSunsetModalStore(state => state.open);

  const handleChange = (newChainId: ChainId | string | number) => {
    const id = Number(newChainId) as ChainId;
    if (isSunsetChain(id)) {
      openSunsetModal();
    }
    switchChain({ chainId: id });
  };

  const options = chains.map<SelectOption<ChainId>>(chain => ({
    label: ({ isRenderedInButton }) => {
      const optionChainId = chain.id as ChainId;
      const metadata = chainMetadata[optionChainId];
      const showSunsetIndicator = isSunsetChain(optionChainId);
      const isActiveChain = optionChainId === chainId;

      return (
        <div className="flex items-center">
          <img src={metadata.iconSrc} alt={metadata.name} className="w-6 max-w-none flex-none" />

          {!isRenderedInButton && (
            <span className={cn('flex ml-2 items-center gap-x-1')}>
              <span>{metadata.name}</span>

              <GaslessStatus chainId={optionChainId} displayLabel />
            </span>
          )}

          {showSunsetIndicator && <SunsetIndicator className="ml-2" interactive={!isActiveChain} />}
        </div>
      );
    },
    value: chain.id,
  }));

  return (
    <>
      <Select
        // When running in Safe Wallet app, it is responsible for the active chain
        disabled={config.isSafeApp}
        value={chainId}
        onChange={handleChange}
        options={options}
        menuPosition="right"
        menuTitle={t('layout.chainSelect.label')}
        {...props}
      />

      <SunsetModal />
    </>
  );
};
