import React from 'react';

import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import { vaults } from '__mocks__/models/vaults';
import { VaultUi } from '.';

export default {
  title: 'Pages/Vault',
  component: VaultUi,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof VaultUi>;

export const Loading = () => <VaultUi vaults={vaults} isInitialLoading />;

export const Default = () => <VaultUi vaults={vaults} isInitialLoading={false} />;
