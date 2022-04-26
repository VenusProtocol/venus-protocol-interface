import React from 'react';
import noop from 'noop-ts';

import { assetData } from '__mocks__/models/asset';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import BorrowRepay from '.';

export default {
  title: 'Pages/Dashboard/Modals/BorrowRepay',
  component: BorrowRepay,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof BorrowRepay>;

export const Default = () => <BorrowRepay asset={assetData[0]} onClose={noop} />;
