import { chainMetadata } from '@venusprotocol/registry';
import { Select, type SelectOption, type SelectProps } from 'components';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { chains, useChainId, useSwitchChain } from 'libs/wallet';
import type { ChainId } from 'types';
import { cn } from 'utilities';
import { GaslessStatus } from '../GaslessStatus';

export interface ChainSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  buttonClassName?: string;
}

const getOptions = ({
  isGaslessTransactionsSettingEnabled,
}: { isGaslessTransactionsSettingEnabled: boolean }) =>
  chains.map<SelectOption<ChainId>>(chain => ({
    label: ({ isRenderedInButton }) => {
      const metadata = chainMetadata[chain.id as ChainId];
      return (
        <div className="flex items-center">
          <img src={metadata.logoSrc} alt={metadata.name} className="w-5 max-w-none flex-none" />

          {isRenderedInButton ? (
            <GaslessStatus
              chainId={chain.id}
              className={cn('md:hidden ml-1', !isGaslessTransactionsSettingEnabled && 'opacity-50')}
            />
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
  const [userChainSettings] = useUserChainSettings();

  return (
    <Select
      value={chainId}
      onChange={newChainId => switchChain({ chainId: Number(newChainId) })}
      options={getOptions({
        isGaslessTransactionsSettingEnabled: !!userChainSettings?.gaslessTransactions,
      })}
      menuPosition="right"
      menuTitle={t('layout.chainSelect.label')}
      {...props}
    />
  );
};
