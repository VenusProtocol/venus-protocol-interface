import { chains as chainMetadata } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';
import { Select, type SelectOption, type SelectProps } from 'components';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';
import { GaslessStatus } from './GaslessStatus';

export interface ChainSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'options' | 'optionClassName'> {
  buttonClassName?: string;
}

export const ChainSelect: React.FC<ChainSelectProps> = props => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { switchChain } = useSwitchChain();

  const options = chains.map<SelectOption<ChainId>>(chain => ({
    label: ({ isRenderedInButton }) => {
      const metadata = chainMetadata[chain.id as ChainId];
      return (
        <div className="flex items-center">
          <img src={metadata.iconSrc} alt={metadata.name} className="w-5 max-w-none flex-none" />

          {!isRenderedInButton && (
            <span className={cn('flex ml-2 grow items-center gap-x-1')}>
              <span>{metadata.name}</span>

              <GaslessStatus chainId={chain.id} displayLabel />
            </span>
          )}
        </div>
      );
    },
    value: chain.id,
  }));

  return (
    <Select
      // When running in Safe Wallet app, it is responsible for the active chain
      disabled={config.isSafeApp}
      value={chainId}
      onChange={newChainId => switchChain({ chainId: Number(newChainId) })}
      options={options}
      menuPosition="right"
      menuTitle={t('layout.chainSelect.label')}
      {...props}
    />
  );
};
