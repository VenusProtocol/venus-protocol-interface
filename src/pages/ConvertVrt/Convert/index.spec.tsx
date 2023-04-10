import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { act } from 'react-dom/test-utils';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeProvider from '__mocks__/models/provider';
import { useGetMainAssets } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Convert from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

const ONE = '1';

describe('pages/ConvertVRT/Convert', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2022-03-01'));
    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimit: new BigNumber('111'),
        userTotalBorrowBalance: new BigNumber('91'),
        userTotalSupplyBalance: new BigNumber('910'),
      },
      isLoading: false,
    }));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('submit button is enabled with input, good vesting period and not loading', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={new BigNumber('0.0000833')}
          vrtConversionEndTime={IN_ONE_YEAR}
          userVrtBalanceWei={new BigNumber('90000083300000000000')}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    const tokenTextInput = getByTestId(TEST_IDS.vrtTokenTextField);
    act(() => {
      fireEvent.change(tokenTextInput, { target: { value: ONE } });
    });
    const submitButton = getByText(en.convertVrt.convertVrtToXvs).closest('button');
    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('submit button is disabled if vesting period has passed', async () => {
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={new BigNumber('0.0000833')}
          vrtConversionEndTime={new Date('2000-01-01')}
          userVrtBalanceWei={new BigNumber('90000083300000000000')}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    const tokenTextInput = getByTestId(TEST_IDS.vrtTokenTextField);
    act(() => {
      fireEvent.change(tokenTextInput, { target: { value: ONE } });
    });
    const submitButton = getByText(en.convertVrt.convertVrtToXvs).closest('button');
    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('submit button is disabled with no input and valid vesting', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={new BigNumber('0.0000833')}
          vrtConversionEndTime={new Date('2000-01-01')}
          userVrtBalanceWei={new BigNumber('90000083300000000000')}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    const submitButton = getByText(en.convertVrt.convertVrtToXvs).closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled with no input and valid vesting', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const { getByTestId, getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={new BigNumber('0.0000833')}
          vrtConversionEndTime={new Date('2000-01-01')}
          userVrtBalanceWei={new BigNumber('90000083300000000000')}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    const submitButton = getByText(en.convertVrt.convertVrtToXvs).closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('xvs is calculate passed on VRT input', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const userVrtBalanceWei = new BigNumber('90000083300000000000');
    const xvsToVrtConversionRatio = new BigNumber('0.0000833');
    const { getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={xvsToVrtConversionRatio}
          vrtConversionEndTime={IN_ONE_YEAR}
          userVrtBalanceWei={userVrtBalanceWei}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    const vrtTextInput = getByTestId(TEST_IDS.vrtTokenTextField);
    act(() => {
      fireEvent.change(vrtTextInput, { target: { value: ONE } });
    });
    const xvsTextInput = getByTestId(TEST_IDS.xvsTokenTextField) as HTMLInputElement;
    expect(xvsTextInput.value).toBe(new BigNumber(ONE).times(xvsToVrtConversionRatio).toFixed());
  });

  it('can convert vrt for xvs with valid input', async () => {
    const convertVrt = jest.fn();
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const userVrtBalanceWei = new BigNumber('90000083300000000000');
    const xvsToVrtConversionRatio = new BigNumber('0.0000833');
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={xvsToVrtConversionRatio}
          vrtConversionEndTime={IN_ONE_YEAR}
          userVrtBalanceWei={userVrtBalanceWei}
          convertVrtLoading={false}
          convertVrt={convertVrt}
        />
      </AuthContext.Provider>,
    );
    const vrtTextInput = await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    await act(async () => {
      await waitFor(() => fireEvent.change(vrtTextInput, { target: { value: ONE } }));
    });
    const submitButton = await waitFor(
      () => getByText(en.convertVrt.convertVrtToXvs).closest('button') as HTMLButtonElement,
    );
    await waitFor(() => expect(submitButton).toBeEnabled());
    await act(async () => {
      await waitFor(() => fireEvent.click(submitButton));
    });
    await waitFor(() => expect(submitButton).toBeDisabled());
    await waitFor(() => expect(convertVrt).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(convertVrt).toHaveBeenCalledWith('1000000000000000000'));
  });

  it('Max button inputs max amount', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const userVrtBalanceWei = new BigNumber('90000083300000000000');
    const xvsToVrtConversionRatio = new BigNumber('0.0000833');
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={xvsToVrtConversionRatio}
          vrtConversionEndTime={IN_ONE_YEAR}
          userVrtBalanceWei={userVrtBalanceWei}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );

    await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));

    const maxButton = getByText(en.convertVrt.max.toUpperCase());
    act(async () => {
      await waitFor(() => fireEvent.click(maxButton));
    });
    const vrtTextInput = getByTestId(TEST_IDS.vrtTokenTextField) as HTMLInputElement;
    expect(vrtTextInput.value).toBe(
      userVrtBalanceWei.dividedBy(new BigNumber(10).pow(18).toFixed()).toFixed(),
    );
  });

  it('cannot convert above limit', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const userVrtBalanceWei = new BigNumber('90000083300000000000');
    const xvsToVrtConversionRatio = new BigNumber('0.0000833');
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={xvsToVrtConversionRatio}
          vrtConversionEndTime={IN_ONE_YEAR}
          userVrtBalanceWei={userVrtBalanceWei}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    const vrtTextInput = await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    await act(async () => {
      await waitFor(() =>
        fireEvent.change(vrtTextInput, {
          target: { value: userVrtBalanceWei.times(userVrtBalanceWei).toFixed() },
        }),
      );
    });
    const submitButton = await waitFor(
      () => getByText(en.convertVrt.convertVrtToXvs).closest('button') as HTMLButtonElement,
    );
    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('cannot convert negative', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const userVrtBalanceWei = new BigNumber('90000083300000000000');
    const xvsToVrtConversionRatio = new BigNumber('0.0000833');
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={xvsToVrtConversionRatio}
          vrtConversionEndTime={IN_ONE_YEAR}
          userVrtBalanceWei={userVrtBalanceWei}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    const vrtTextInput = await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    await act(async () => {
      await waitFor(() =>
        fireEvent.change(vrtTextInput, {
          target: { value: userVrtBalanceWei.times(-1).toFixed() },
        }),
      );
    });
    const submitButton = await waitFor(
      () => getByText(en.convertVrt.convertVrtToXvs).closest('button') as HTMLButtonElement,
    );
    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('cannot convert 0', async () => {
    const IN_ONE_YEAR = new Date();
    IN_ONE_YEAR.setFullYear(IN_ONE_YEAR.getFullYear() + 1);
    const userVrtBalanceWei = new BigNumber('90000083300000000000');
    const xvsToVrtConversionRatio = new BigNumber('0.0000833');
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Convert
          xvsToVrtConversionRatio={xvsToVrtConversionRatio}
          vrtConversionEndTime={IN_ONE_YEAR}
          userVrtBalanceWei={userVrtBalanceWei}
          convertVrtLoading={false}
          convertVrt={jest.fn()}
        />
      </AuthContext.Provider>,
    );
    const vrtTextInput = await waitFor(() => getByTestId(TEST_IDS.vrtTokenTextField));
    await act(async () => {
      await waitFor(() => fireEvent.change(vrtTextInput, { target: { value: '0' } }));
    });
    const submitButton = await waitFor(
      () => getByText(en.convertVrt.convertVrtToXvs).closest('button') as HTMLButtonElement,
    );
    await waitFor(() => expect(submitButton).toBeDisabled());
  });
});
