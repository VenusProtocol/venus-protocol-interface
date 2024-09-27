import { forwardRef } from 'react';

import type { ChainId } from '@venusprotocol/chains';
import { chainMetadata } from '@venusprotocol/chains';
import { Select, type SelectOption, type SelectProps } from 'components';
import { chains } from 'libs/wallet';

export const getOptionsFromChainsList = (chainsList: typeof chains) =>
  chainsList.map(chain => {
    const metadata = chainMetadata[chain.id as ChainId];
    const option: SelectOption<ChainId> = {
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
      variant="quaternary"
      size="large"
      {...props}
    />
  ),
);
