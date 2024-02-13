import { chains } from 'libs/wallet';
import { forwardRef } from 'react';

import { Select, SelectOption, SelectProps } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ChainId } from 'types';

export const getOptionsFromChainsList = (chainsList: typeof chains) =>
  chainsList.map(chain => {
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

const defaultOptions = getOptionsFromChainsList(chains);

type SelectPropsOptionalOptions = Pick<Partial<SelectProps>, 'options'> &
  Omit<SelectProps, 'options'>;
export type ChainSelectProps = SelectPropsOptionalOptions;

export const ChainSelect = forwardRef<React.ElementRef<typeof Select>, ChainSelectProps>(
  ({ value, options = defaultOptions, ...props }, ref) => (
    <Select
      value={value}
      options={options}
      ref={ref}
      buttonClassName="bg-lightGrey hover:border-blue"
      {...props}
    />
  ),
);
