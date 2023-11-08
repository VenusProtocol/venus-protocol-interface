import { Select, SelectOption } from 'components';
import bnbLogo from 'packages/tokens/img/bnb.svg';
import ethLogo from 'packages/tokens/img/eth.svg';
import { useTranslation } from 'translation';
import { ChainId } from 'types';
import { cn } from 'utilities';

import { chains } from 'clients/web3';
import { useAuth } from 'context/AuthContext';

export interface ChainSelectProps {
  className?: string;
  buttonClassName?: string;
}

const nativeTokenLogoMapping: {
  [chainId in ChainId]: string;
} = {
  [ChainId.BSC_MAINNET]: bnbLogo,
  [ChainId.BSC_TESTNET]: bnbLogo,
  [ChainId.ETHEREUM]: ethLogo,
  [ChainId.SEPOLIA]: ethLogo,
};

const options: SelectOption<ChainId>[] = chains.map(chain => ({
  label: ({ isRenderedInButton }) => (
    <div className="flex items-center">
      <img
        src={nativeTokenLogoMapping[chain.id as ChainId]}
        alt={chain.name}
        className="w-5 max-w-none flex-none"
      />

      <span
        className={cn(
          'ml-2 grow overflow-hidden text-ellipsis',
          isRenderedInButton && 'hidden lg:block',
        )}
      >
        {chain.name}
      </span>
    </div>
  ),
  value: chain.id,
}));

export const ChainSelect: React.FC<ChainSelectProps> = ({ className, buttonClassName }) => {
  const { t } = useTranslation();
  const { chainId, switchChain } = useAuth();

  return (
    <Select
      value={chainId}
      onChange={newChainId => switchChain({ chainId: newChainId })}
      options={options}
      menuPosition="right"
      menuTitle={t('layout.chainSelect.label')}
      buttonClassName={buttonClassName}
      className={cn('lg:min-w-[200px]', className)}
    />
  );
};
