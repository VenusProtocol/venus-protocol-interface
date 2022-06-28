import React from 'react';
import { ComponentMeta } from '@storybook/react';
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
} as ComponentMeta<typeof Description>;

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
    data: '',
    signature: '',
    target: '',
    title:
      '[Unitroller.](https://bscscan.com/address/0x70f657164e5b75689b64b7fd1fa275f334f28e18)assumeOwnership("0x0000000000000000000000000000000000000000")',
    value: '',
  },
  {
    data: '',
    signature: '',
    target: '',
    title:
      '[Unitroller.](https://bscscan.com/address/0x70f657164e5b75689b64b7fd1fa275f334f28e18)setRate(0.04)',
    value: '',
  },
];

export const DescriptionV1 = () => <Description description={descriptionV1} actions={actions} />;

export const DescriptionV2 = () => <Description description={descriptionV2} actions={actions} />;
