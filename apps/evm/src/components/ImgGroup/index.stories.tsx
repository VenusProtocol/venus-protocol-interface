import type { Meta } from '@storybook/react';

import { bnb, eth, lisUsd, usdc, usdt, xvs } from '__mocks__/models/tokens';

import { ImgGroup } from '.';

export default {
  title: 'Components/ImgGroup',
  component: ImgGroup,
} as Meta<typeof ImgGroup>;

const imgSrcs = [usdt, eth, usdc, xvs, bnb, lisUsd].map(token => token.iconSrc);

export const Default = () => <ImgGroup imgSrcs={imgSrcs} />;

export const WithLimit = () => <ImgGroup imgSrcs={imgSrcs} limit={3} />;
