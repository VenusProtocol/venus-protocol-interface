import { Select, SelectOption, SelectProps } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { chains } from 'packages/wallet';
import { ChainId } from 'types';

const options = chains.map(chain => {
  const metadata = CHAIN_METADATA[chain.id as ChainId];
  const option: SelectOption<ChainId> = {
    // TODO: display wallet balance for each token
    label: (
      <div className="flex items-center">
        <img src={metadata.logoSrc} alt={metadata.name} className="w-5 max-w-none flex-none" />

        <span className="ml-2 grow overflow-hidden text-ellipsis">{metadata.name}</span>
      </div>
    ),
    value: chain.id,
  };

  return option;
});

export type ChainSelectProps = Omit<SelectProps, 'options'>;

export const ChainSelect: React.FC<ChainSelectProps> = ({ value, ...props }) => (
  <Select
    value={value}
    options={options}
    buttonClassName="bg-lightGrey hover:border-blue"
    {...props}
  />
);
