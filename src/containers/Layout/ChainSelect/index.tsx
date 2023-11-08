import { Select, SelectOption } from 'components';

import { chains } from 'clients/web3';
import { useAuth } from 'context/AuthContext';

export interface ChainSelectProps {
  className?: string;
}

const options: SelectOption[] = chains.map(chain => ({
  label: chain.name, // TODO: add chain icon
  value: chain.id,
}));

export const ChainSelect: React.FC<ChainSelectProps> = ({ className }) => {
  const { chainId } = useAuth();

  return (
    <Select
      value={chainId}
      // TODO: wire up
      onChange={newChainId => console.log('Change chain to', newChainId)}
      options={options}
      className={className}
    />
  );
};
