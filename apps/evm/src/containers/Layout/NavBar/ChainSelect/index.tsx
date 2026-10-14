import { chains as chainMetadata } from '@venusprotocol/chains';
import { Select, type SelectOption, type SelectProps } from 'components';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';
import { GaslessStatus } from './GaslessStatus';

export interface ChainSelectProps
  extends Omit<
    SelectProps,
    'value' | 'onChange' | 'options' | 'optionClassName' | 'triggerOnHover'
  > {
  buttonClassName?: string;
}

export const ChainSelect: React.FC<ChainSelectProps> = props => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { switchChain } = useSwitchChain();

  const handleChange = (newChainId: ChainId | string | number) =>
    switchChain({ chainId: Number(newChainId) as ChainId });

  const options = chains.map<SelectOption<ChainId>>(chain => ({
    label: ({ isRenderedInButton }) => {
      const optionChainId = chain.id as ChainId;
      const metadata = chainMetadata[optionChainId];

      return (
        <div className="flex items-center">
          <img src={metadata.iconSrc} alt={metadata.name} className="w-6 max-w-none flex-none" />

          {!isRenderedInButton && (
            <span className="flex ml-2 items-center gap-x-1">
              <span>{metadata.name}</span>

              <GaslessStatus chainId={optionChainId} displayLabel />
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
      onChange={handleChange}
      options={options}
      menuPosition="right"
      menuTitle={t('layout.chainSelect.label')}
      triggerOnHover
      {...props}
    />
  );
};
