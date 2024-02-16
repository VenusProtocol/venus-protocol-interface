import { CHAIN_METADATA } from '@venusprotocol/web3';

import { Select, SelectOption } from 'components';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import { ChainId } from 'types';
import { cn } from 'utilities';

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

        <span
          className={cn(
            'ml-2 grow overflow-hidden text-ellipsis',
            isRenderedInButton && 'hidden lg:block',
          )}
        >
          {metadata.name}
        </span>
      </div>
    ),
    value: chain.id,
  };
});

export const ChainSelect: React.FC<ChainSelectProps> = ({ className, buttonClassName }) => {
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
      buttonClassName={buttonClassName}
      className={cn('lg:min-w-[200px]', className)}
    />
  );
};
