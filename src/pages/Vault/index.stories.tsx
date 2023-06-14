import { Meta } from '@storybook/react';
import React from 'react';

import { vaults } from '__mocks__/models/vaults';
import { withRouter } from 'stories/decorators';

import { VaultUi } from '.';

export default {
  title: 'Pages/Vault',
  component: VaultUi,
  decorators: [withRouter],
} as Meta<typeof VaultUi>;

export const Loading = () => <VaultUi vaults={vaults} isInitialLoading />;

export const Default = () => <VaultUi vaults={vaults} isInitialLoading={false} />;
