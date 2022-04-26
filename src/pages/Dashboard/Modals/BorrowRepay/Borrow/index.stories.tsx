import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';

import { ComponentMeta } from '@storybook/react';
import { assetData } from '__mocks__/models/asset';
import { withCenterStory } from 'stories/decorators';
import { AmountForm } from 'containers/AmountForm';
import { BorrowUi } from '.';

export default {
  title: 'Pages/Dashboard/Modals/BorrowRepay/Borrow',
  component: BorrowUi,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof BorrowUi>;

export const Default = () => (
  <AmountForm onSubmit={noop}>
    {({ values, setFieldValue, handleBlur, dirty, isValid }) => (
      <BorrowUi
        asset={assetData[0]}
        disabled={false}
        safeBorrowLimitPercentage={80}
        userTotalBorrowBalanceCents={new BigNumber('100000')}
        userBorrowLimitCents={new BigNumber('2000000')}
        calculateDailyEarningsCents={tokenAmount => new BigNumber('100').plus(tokenAmount)}
        values={values}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        dirty={dirty}
        isValid={isValid}
      />
    )}
  </AmountForm>
);
