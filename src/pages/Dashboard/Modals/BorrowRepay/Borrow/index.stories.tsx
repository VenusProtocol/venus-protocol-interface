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
  <AmountForm onSubmit={noop} maxAmount="14859.150116049962406">
    {({ values, setFieldValue, handleBlur, dirty, isValid, errors }) => (
      <BorrowUi
        asset={assetData[0]}
        safeBorrowLimitPercentage={80}
        safeBorrowLimitCoins="11730.907986355233479"
        totalBorrowBalanceCents={new BigNumber('100000')}
        borrowLimitCents={new BigNumber('2000000')}
        calculateDailyEarningsCents={tokenAmount => new BigNumber('100').plus(tokenAmount)}
        values={values}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        dirty={dirty}
        isValid={isValid}
        errors={errors}
      />
    )}
  </AmountForm>
);
