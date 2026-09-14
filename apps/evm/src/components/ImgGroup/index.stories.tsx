import type { Meta } from '@storybook/react';

import { bnb, eth, lisUsd, usdc, usdt, xvs } from '__mocks__/models/tokens';

import { ImgGroup } from '.';

export default {
  title: 'Components/ImgGroup',
  component: ImgGroup,
} as Meta<typeof ImgGroup>;

const imgs = [usdt, eth, usdc, xvs, bnb, lisUsd].map(token => ({
  src: token.iconSrc,
  alt: token.symbol,
}));

export const Default = () => <ImgGroup imgs={imgs} />;

export const WithLimit = () => <ImgGroup imgs={imgs} limit={3} />;
