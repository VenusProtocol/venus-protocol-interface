import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { Button } from 'components';
import { TextField } from '.';

export default {
  title: 'Components/TextField',
  component: TextField,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof TextField>;

export const Default = () => <TextField placeholder="0.0" type="number" min={0} />;

export const WithLabel = () => <TextField label="Label" placeholder="0.0" type="number" min={0} />;

export const WithDescription = () => (
  <TextField description="This is a fake description" placeholder="0.0" type="number" min={0} />
);

export const WithLeftIcon = () => (
  <TextField leftIconName="xvs" placeholder="0.0" type="number" min={0} />
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
