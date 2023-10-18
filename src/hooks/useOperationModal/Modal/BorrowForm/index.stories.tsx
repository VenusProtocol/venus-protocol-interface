import { Meta } from '@storybook/react';
import noop from 'noop-ts';

import { poolData } from '__mocks__/models/pools';
import { xvs } from '__mocks__/models/tokens';
import { withCenterStory } from 'stories/decorators';

import { BorrowFormUi } from '.';

const fakePool = poolData[0];
const fakeAsset = fakePool.assets[2];

export default {
  title: 'Components/OperationModal/BorrowForm',
  component: BorrowFormUi,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof BorrowFormUi>;

export const Default = () => (
  <BorrowFormUi
    asset={fakeAsset}
    pool={fakePool}
    onSubmit={noop}
    onCloseModal={noop}
    isSubmitting={false}
    formValues={{
      fromToken: xvs,
      amountTokens: '',
    }}
    setFormValues={noop}
  />
);
