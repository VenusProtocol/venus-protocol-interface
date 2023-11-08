import { Select, SelectOption } from 'components';
import bnbLogo from 'packages/tokens/img/bnb.svg';
import ethLogo from 'packages/tokens/img/eth.svg';
import { ChainId } from 'types';

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

const options: SelectOption[] = chains.map(chain => ({
  label: (
    <div className="@container md:@container-normal flex w-full min-w-[20px] items-center">
      <img
        src={nativeTokenLogoMapping[chain.id as ChainId]}
        alt={chain.name}
        className="w-5 flex-none"
      />

      <span className="@[21px]:block ml-2 hidden overflow-hidden text-ellipsis md:block">
        {chain.name}
      </span>
    </div>
  ),
  value: chain.id,
}));

export const ChainSelect: React.FC<ChainSelectProps> = ({ ...otherProps }) => {
  const { chainId } = useAuth();

  return (
    <Select
      value={chainId}
      // TODO: wire up
      onChange={newChainId => console.log('Change chain to', newChainId)}
      options={options}
      {...otherProps}
    />
  );
};
