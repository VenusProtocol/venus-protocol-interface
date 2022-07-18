import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withRouter } from 'stories/decorators';

import { PageContainer } from '.';

export default {
  title: 'Components/Layout/PageContainer',
  component: PageContainer,
  decorators: [withRouter],
} as ComponentMeta<typeof PageContainer>;

export const PageContainerDefault = () => <PageContainer>Hello from storybook</PageContainer>;
