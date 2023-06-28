import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { State } from 'react-powerplug';

import { TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { TokenTextField } from '.';

export default {
  title: 'Components/TokenTextField',
  component: TokenTextField,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      // default: 'background.default',
    },
  },
} as Meta<typeof TokenTextField>;

const initialData: { value: string } = { value: '' };

export const Default = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        token={TOKENS.xvs}
        value={state.value}
        onChange={value => setState({ value })}
      />
    )}
  </State>
);

export const WithMaxTokens = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        token={TOKENS.xvs}
        value={state.value}
        onChange={value => setState({ value })}
        max="10"
      />
    )}
  </State>
);

export const WithRightMaxButtonLabel = () => (
  <State initial={initialData}>
    {({ state, setState }) => (
      <TokenTextField
        token={TOKENS.xvs}
        value={state.value}
        onChange={value => setState({ value })}
        max="10"
        rightMaxButton={{
          label: '80% limit',
          onClick: noop,
        }}
      />
    )}
  </State>
);
