import { Meta } from '@storybook/react';
import { Button } from 'components';
import React from 'react';

import { TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { TextField } from '.';

export default {
  title: 'Components/TextField',
  component: TextField,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof TextField>;

export const Default = () => <TextField placeholder="0.0" type="number" min={0} />;

export const WithLabel = () => <TextField label="Label" placeholder="0.0" type="number" min={0} />;

export const WithDescription = () => (
  <TextField description="This is a fake description" placeholder="0.0" type="number" min={0} />
);

export const WithIsSmall = () => <TextField placeholder="0.0" type="number" min={0} isSmall />;

export const WithLeftIcon = () => (
  <TextField leftIconSrc={TOKENS.xvs} placeholder="0.0" type="number" min={0} />
);

export const WithRightAdornment = () => (
  <TextField rightAdornment={<Button>Safe max</Button>} placeholder="0.0" type="number" min={0} />
);

export const WithHasError = () => (
  <TextField label="Label" placeholder="0.0" type="number" min={0} hasError />
);

export const WithMinAndMax = () => (
  <TextField label="Label" placeholder="0.0" type="number" min={0} max={100} />
);

export const Disabled = () => <TextField placeholder="0.0" type="number" min={0} disabled />;
