import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Vault from '.';

export default {
  title: 'Pages/Vault',
  component: Vault,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Vault>;

export { Vault };
