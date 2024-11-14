import type { Meta } from '@storybook/react';

import { Notice } from '.';

export default {
  title: 'Components/Notice',
  component: Notice,
} as Meta<typeof Notice>;

export const Default = () => (
  <Notice
    title="Withdrawal is made using a smart contract"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
export const Failure = () => (
  <Notice
    variant="error"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
export const Success = () => (
  <Notice
    variant="success"
    title="Withdrawal is made using a smart contract"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
export const Warning = () => (
  <Notice
    variant="warning"
    title="Withdrawal is made using a smart contract"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
