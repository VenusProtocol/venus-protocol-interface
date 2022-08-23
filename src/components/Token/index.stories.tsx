import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { Token } from '.';

export default {
  title: 'Components/Token',
  component: Token,
  decorators: [withCenterStory({ width: 100 })],
} as ComponentMeta<typeof Token>;

export const Default = () => <Token tokenId="xvs" />;

export const WithoutSymbol = () => <Token tokenId="xvs" displaySymbol={false} />;
