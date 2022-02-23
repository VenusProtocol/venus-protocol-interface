import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider } from 'stories/decorators';
import { Icon, IconName } from '.';

export default {
  title: 'Icon',
  component: Icon,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Icon>;

export const IconDefault = () => {
  // Get all SVG file names
  const svgs = require.context('./icons', true, /\.svg$/);
  const svgFileNames = svgs
    .keys()
    .map(path => path.replace('./', '').replace('.svg', '')) as IconName[];

  return (
    <>
      {svgFileNames.map(svgFileName => (
        <Icon name={svgFileName} key={svgFileName} />
      ))}
    </>
  );
};

export const IconWithCustomColorAndSize = () => <Icon name="mask" size={32} color="#345345" />;
