import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { MultiSelect } from '.';

const collateralSymbols = [
  'BPNC',
  'SPYB',
  'QQQB',
  'NVDAB',
  'SPCXB',
  'GOOGLB',
  'TSMB',
  'AAPLB',
  'AMDB',
  'MRNAB',
  'METAB',
  'TSLAB',
  'MSFTB',
  'BEB',
  'SKHYB',
  'DRAMB',
  'MUB',
  'CRCLB',
  'COINB',
  'MSTRB',
  'NBISB',
  'SNDKB',
  'INTCB',
];

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  render: args => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <div className="w-60">
        <MultiSelect {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    placeholder: 'All collaterals',
    renderCount: count => `${count} collaterals`,
    title: 'Select collaterals',
    resetLabel: 'Reset',
    searchPlaceholder: 'Search collateral',
    noResultsLabel: 'No results found',
    value: [],
    onChange: () => {},
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FewOptions: Story = {
  args: {
    options: ['USDT', 'U', 'USDC'].map(symbol => ({ value: symbol, label: symbol })),
  },
};

export const ManyOptions: Story = {
  args: {
    options: collateralSymbols.map(symbol => ({ value: symbol, label: symbol })),
  },
};
