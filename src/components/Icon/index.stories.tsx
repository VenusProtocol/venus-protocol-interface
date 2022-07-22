import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { Icon, IconName, IconProps } from '.';

export default {
  title: 'Components/Icon',
  component: Icon,
  decorators: [withCenterStory({ width: '50vw' })],
} as ComponentMeta<typeof Icon>;

export const IconDefault = () => {
  // Get all SVG file names
  const svgs = require.context('./icons', true, /\.tsx$/);
  const svgFileNames = svgs
    .keys()
    .map(path => path.replace('./', '').replace('tokens/', '').replace('.tsx', '')) as IconName[];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {svgFileNames.map(svgFileName => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: '0 0 21%',
          }}
        >
          <h4 style={{ marginRight: '8px' }}>{svgFileName}</h4>
          <Icon name={svgFileName} key={svgFileName} />
        </div>
      ))}
    </div>
  );
};

const IconWithCustomColorAndSizeTemplate: Story<IconProps> = args => <Icon {...args} />;

export const IconWithCustomColorAndSize = IconWithCustomColorAndSizeTemplate.bind({});
IconWithCustomColorAndSize.args = {
  name: 'mask',
  size: '32px',
  color: '#345345',
};
