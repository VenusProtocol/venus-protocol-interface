import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { Icon, IconName, IconProps } from '.';
import * as Svgs from './icons';

export default {
  title: 'Components/Icon',
  component: Icon,
  decorators: [withCenterStory({ width: '50vw' })],
} as Meta<typeof Icon>;

export const IconDefault = () => {
  // Get all SVG file names
  const svgFileNames = Object.keys(Svgs) as IconName[];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px' }}>
      {svgFileNames.map(svgFileName => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h4 style={{ marginRight: '8px' }}>{svgFileName}</h4>
          <Icon name={svgFileName} key={svgFileName} />
        </div>
      ))}
    </div>
  );
};

const IconWithCustomColorAndSizeTemplate: StoryFn<IconProps> = args => <Icon {...args} />;

export const IconWithCustomColorAndSize = IconWithCustomColorAndSizeTemplate.bind({});
IconWithCustomColorAndSize.args = {
  name: 'mask',
  size: '32px',
  color: '#345345',
};
