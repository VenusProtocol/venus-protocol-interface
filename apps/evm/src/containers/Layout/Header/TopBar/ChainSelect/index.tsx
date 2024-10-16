import { Select, type SelectOption, type SelectProps } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';
import { cn } from 'utilities';
import { GaslessStatus } from '../GaslessStatus';

export interface ChainSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  buttonClassName?: string;
}

const options: SelectOption<ChainId>[] = chains.map(chain => ({
  label: ({ isRenderedInButton }) => {
    const metadata = CHAIN_METADATA[chain.id as ChainId];
    return (
      <div className="flex items-center">
        <img src={metadata.logoSrc} alt={metadata.name} className="w-5 max-w-none flex-none" />

        {isRenderedInButton ? (
          <GaslessStatus chainId={chain.id} className="md:hidden ml-1" />
        ) : (
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

export const ChainSelect: React.FC<ChainSelectProps> = props => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { switchChain } = useSwitchChain();

  return (
    <Select
      value={chainId}
      onChange={newChainId => switchChain({ chainId: Number(newChainId) })}
      options={options}
      menuPosition="right"
      menuTitle={t('layout.chainSelect.label')}
      {...props}
    />
  );
};
