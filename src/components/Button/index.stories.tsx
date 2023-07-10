import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withRouter } from 'stories/decorators';

import {
  Button,
  LinkButton,
  PrimaryButton,
  QuaternaryButton,
  QuinaryButton,
  SecondaryButton,
  SenaryButton,
  TertiaryButton,
  TextButton,
} from '.';

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [withCenterStory({ width: 250 })],
} as Meta<typeof Button>;

export const Primary = () => <PrimaryButton onClick={console.log}>Primary</PrimaryButton>;
export const Secondary = () => <SecondaryButton onClick={console.log}>Secondary</SecondaryButton>;
export const Tertiary = () => <TertiaryButton onClick={console.log}>Tertiary</TertiaryButton>;
export const Quaternary = () => (
  <QuaternaryButton onClick={console.log}>Quaternary</QuaternaryButton>
);
export const Quinary = () => <QuinaryButton onClick={console.log}>Quinary</QuinaryButton>;
export const Senary = () => <SenaryButton onClick={console.log}>Senary</SenaryButton>;
export const Text = () => <TextButton onClick={console.log}>Text</TextButton>;

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

export const Active = () => (
  <PrimaryButton onClick={console.log} active>
    Active
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
