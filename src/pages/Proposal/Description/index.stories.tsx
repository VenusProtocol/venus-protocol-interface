import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withRouter } from 'stories/decorators';
import { Description } from '.';

export default {
  title: 'Pages/Proposal/Description',
  component: Description,
  decorators: [withRouter, withCenterStory({ width: 500 })],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
} as ComponentMeta<typeof Description>;

const descriptionMarkdown =
  '### Support UST and LUNA markets\n\nUST\n\n* Collateral factor: 80%\n* Reserve factor: 20%\n* Rate model: kink 80%, base 0, multiplier 5%, jump multiplier 109%\n* XVS distribution: 50 XVS/day\n\nLUNA\n* Collateral factor: 55%\n* Reserve factor: 25%\n* Rate model: kink 60%, base 2%, multiplier 15%, jump multiplier 300%\n* XVS distribution: 75 XVS/day';

export const Default = () => <Description descriptionMarkdown={descriptionMarkdown} />;
