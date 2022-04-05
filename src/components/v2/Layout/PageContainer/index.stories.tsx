import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import { PageContainer } from '.';

export default {
  title: 'Components/Layout/PageContainer',
  component: PageContainer,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof PageContainer>;

export const PageContainerDefault = () => <PageContainer>Hello from storybook</PageContainer>;
