import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withRouter } from 'stories/decorators';

import { Button, LinkButton, PrimaryButton, SecondaryButton, TertiaryButton, TextButton } from '.';

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [withCenterStory({ width: 250 })],
} as ComponentMeta<typeof Button>;

export const Primary = () => <PrimaryButton onClick={console.log}>Primary</PrimaryButton>;
export const Secondary = () => <SecondaryButton onClick={console.log}>Secondary</SecondaryButton>;
export const Tertiary = () => <TertiaryButton onClick={console.log}>Tertiary</TertiaryButton>;
export const Text = () => <TextButton onClick={console.log}>Text</TextButton>;

export const Small = () => (
  <PrimaryButton onClick={console.log} small>
    Small
  </PrimaryButton>
);

export const FullWidth = () => (
  <PrimaryButton onClick={console.log} fullWidth>
    Full width
  </PrimaryButton>
);

export const Disabled = () => (
  <PrimaryButton onClick={console.log} disabled>
    Disabled
  </PrimaryButton>
);

export const Link = () => (
  <LinkButton onClick={console.log} to="/">
    Link
  </LinkButton>
);
Link.story = {
  decorators: [withRouter],
};

export const Loading = () => (
  <PrimaryButton onClick={console.log} loading>
    Loading
  </PrimaryButton>
);
Loading.story = {
  parameters: {
    loki: { skip: true },
  },
};
