import { Meta } from '@storybook/react';
import React from 'react';

import tokens from '__mocks__/models/tokens';
import { withCenterStory, withRouter } from 'stories/decorators';

import { Description } from '.';

export default {
  title: 'Pages/Proposal/Description',
  component: Description,
  decorators: [withRouter, withCenterStory({ width: 1000 })],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
} as Meta<typeof Description>;

const descriptionV1 = {
  version: 'v1' as const,
  title: '# Interesting title',
  description:
    '### Support UST and LUNA markets\n\nUST\n\n* Collateral factor: 80%\n* Reserve factor: 20%\n* Rate model: kink 80%, base 0, multiplier 5%, jump multiplier 109%\n* XVS distribution: 50 XVS/day\n\nLUNA\n* Collateral factor: 55%\n* Reserve factor: 25%\n* Rate model: kink 60%, base 2%, multiplier 15%, jump multiplier 300%\n* XVS distribution: 75 XVS/day',
};

const descriptionV2 = {
  version: 'v2' as const,
  title: '# Interesting title',
  description:
    '### Support UST and LUNA markets\n\nUST\n\n* Collateral factor: 80%\n* Reserve factor: 20%\n* Rate model: kink 80%, base 0, multiplier 5%, jump multiplier 109%\n* XVS distribution: 50 XVS/day\n\nLUNA\n* Collateral factor: 55%\n* Reserve factor: 25%\n* Rate model: kink 60%, base 2%, multiplier 15%, jump multiplier 300%\n* XVS distribution: 75 XVS/day',
  forDescription: 'Yes!',
  againstDescription: 'No!',
  abstainDescription: 'Maybe!',
};

const actions = [
  {
    callData: '',
    signature: '',
    target: '',
    value: '',
  },
  {
    callData: '',
    signature: '',
    target: '',
    value: '',
  },
];

export const DescriptionV1 = () => (
  <Description description={descriptionV1} actions={actions} tokens={tokens} />
);

export const DescriptionV2 = () => (
  <Description description={descriptionV2} actions={actions} tokens={tokens} />
);
