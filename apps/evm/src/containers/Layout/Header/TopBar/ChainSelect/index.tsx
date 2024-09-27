import type { ChainId } from '@venusprotocol/chains';
import { chainMetadata } from '@venusprotocol/chains';
import { Select, type SelectOption, type SelectProps } from 'components';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import { cn } from 'utilities';

export interface ChainSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  buttonClassName?: string;
}

const options: SelectOption<ChainId>[] = chains.map(chain => {
  const metadata = chainMetadata[chain.id as ChainId];

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
