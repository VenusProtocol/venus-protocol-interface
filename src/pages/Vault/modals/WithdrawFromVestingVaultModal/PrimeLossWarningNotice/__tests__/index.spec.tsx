import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { useGetPrimeStatus, useGetPrimeToken } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import PrimeLossWarningNotice from '..';
import TEST_IDS from '../testIds';

const fakePoolIndex = 6;

describe('PrimeLossWarningNotice', () => {
  beforeEach(() => {
    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        primeMinimumStakedXvsMantissa: new BigNumber('1000000000000000000'),
        xvsVaultPoolId: fakePoolIndex,
      },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<PrimeLossWarningNotice poolIndex={fakePoolIndex} />, {
      authContextValue: { accountAddress: fakeAddress },
    });
  });

  it('displays nothing if vault is not relevant to Prime', () => {
    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        xvsVaultPoolId: 99999,
      },
    }));

    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));

    const { queryByTestId } = renderComponent(
      <PrimeLossWarningNotice poolIndex={fakePoolIndex} />,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    expect(queryByTestId(TEST_IDS.notice)).toBeNull();
  });

  it('displays nothing if user does not have a Prime token', () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));

    const { queryByTestId } = renderComponent(
      <PrimeLossWarningNotice poolIndex={fakePoolIndex} />,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    expect(queryByTestId(TEST_IDS.notice)).toBeNull();
  });

  it('displays nothing if user has an irrevocable Prime token', () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: true,
        isIrrevocable: true,
      },
    }));

    const { queryByTestId } = renderComponent(
      <PrimeLossWarningNotice poolIndex={fakePoolIndex} />,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    expect(queryByTestId(TEST_IDS.notice)).toBeNull();
  });

  it('displays warning if user has a revocable Prime token', () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: true,
        isIrrevocable: false,
      },
    }));

    const { getByTestId } = renderComponent(<PrimeLossWarningNotice poolIndex={fakePoolIndex} />, {
      authContextValue: { accountAddress: fakeAddress },
    });

    expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
      '"You will lose your Prime token if your stake in the XVS vault goes below 1.00 XVS"',
    );
  });
});
