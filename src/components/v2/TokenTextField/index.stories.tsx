import React from 'react';
import { State } from 'react-powerplug';
import BigNumber from 'bignumber.js';
import { ComponentMeta } from '@storybook/react';

import { withCenterStory } from 'stories/decorators';
import { TokenTextField } from '.';

export default {
  title: 'Components/TokenTextField',
  component: TokenTextField,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Paper',
    },
  },
} as ComponentMeta<typeof TokenTextField>;

const initialData: { valueWei: BigNumber | '' } = { valueWei: '' };

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        tokenSymbol="usdt"
        value={state.valueWei}
        onChange={valueWei => setState({ valueWei })}
      />
    )}
  </State>
);

export const WithMaxWei = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        tokenSymbol="xvs"
        value={state.valueWei}
        onChange={valueWei => setState({ valueWei })}
        maxWei={new BigNumber(10).pow(18).multipliedBy(10000)}
      />
    )}
  </State>
);

export const WithRightMaxButtonLabel = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        tokenSymbol="usdt"
        value={state.valueWei}
        onChange={valueWei => setState({ valueWei })}
        maxWei={new BigNumber(10).pow(6).multipliedBy(80)}
        rightMaxButtonLabel="80% limit"
      />
    )}
  </State>
);
