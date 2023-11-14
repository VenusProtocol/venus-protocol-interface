import {
  MainPoolComptroller,
  Prime,
  ResilientOracle,
  VaiController,
  VenusLens,
} from 'packages/contracts';
import Vi from 'vitest';

import fakeMainPoolComptrollerContractResponses from '__mocks__/contracts/mainPoolComptroller';
import fakePrimeContractResponses from '__mocks__/contracts/prime';
import fakeVenusLensContractResponses from '__mocks__/contracts/venusLens';
import fakeAccountAddress, { altAddress } from '__mocks__/models/address';
import { markets } from '__mocks__/models/markets';
import tokens, { vai, xvs } from '__mocks__/models/tokens';

import getMainPool from '..';
import getMainMarkets from '../../getMainMarkets';
import {
  fakeBorrowCapsOutputs,
  fakeGetAssetsInOutput,
  fakeGetUnderlyingPriceOutputs,
  fakeGetVaiRepayAmountOutput,
  fakeGetXvsPriceOutput,
  fakeSupplyCapsOutputs,
  fakeVTokenBalancesAllOutput,
  fakeXvsBorrowSpeedOutputs,
  fakeXvsSupplySpeedOutputs,
} from '../__testUtils__/fakeData';

vi.mock('clients/subgraph');
vi.mock('../../getMainMarkets');

const fakeMainPoolComptrollerContract = {
  address: altAddress,
  getAllMarkets: async () => fakeMainPoolComptrollerContractResponses.getAllMarkets,
  getAssetsIn: async () => fakeGetAssetsInOutput,
  borrowCaps: async (vTokenAddress: keyof typeof fakeBorrowCapsOutputs) =>
    fakeBorrowCapsOutputs[vTokenAddress],
  supplyCaps: async (vTokenAddress: keyof typeof fakeSupplyCapsOutputs) =>
    fakeSupplyCapsOutputs[vTokenAddress],
  venusBorrowSpeeds: async (vTokenAddress: keyof typeof fakeXvsBorrowSpeedOutputs) =>
    fakeXvsBorrowSpeedOutputs[vTokenAddress],
  venusSupplySpeeds: async (vTokenAddress: keyof typeof fakeXvsSupplySpeedOutputs) =>
    fakeXvsSupplySpeedOutputs[vTokenAddress],
} as unknown as MainPoolComptroller;

const fakeResilientOracleContract = {
  getPrice: async () => fakeGetXvsPriceOutput,
  getUnderlyingPrice: async (vTokenAddress: keyof typeof fakeGetUnderlyingPriceOutputs) =>
    fakeGetUnderlyingPriceOutputs[vTokenAddress],
} as unknown as ResilientOracle;

const fakeVaiControllerContract = {
  callStatic: {
    accrueVAIInterest: vi.fn(),
  },
  getVAIRepayAmount: async () => fakeGetVaiRepayAmountOutput,
} as unknown as VaiController;

const fakeVenusLensContract = {
  callStatic: {
    vTokenMetadataAll: async () => fakeVenusLensContractResponses.vTokenMetadataAll,
    vTokenBalancesAll: async () => fakeVTokenBalancesAllOutput,
  },
} as unknown as VenusLens;

describe('getMainPool', () => {
  beforeEach(() => {
    (getMainMarkets as Vi.Mock).mockImplementation(() => ({ markets }));
  });

  it('returns main pool in the correct format', async () => {
    const response = await getMainPool({
      blocksPerDay: 28800,
      name: 'Fake pool name',
      description: 'Fake pool description',
      xvs,
      vai,
      tokens,
      accountAddress: fakeAccountAddress,
      mainPoolComptrollerContract: fakeMainPoolComptrollerContract,
      venusLensContract: fakeVenusLensContract,
      vaiControllerContract: fakeVaiControllerContract,
      resilientOracleContract: fakeResilientOracleContract,
    });

    // Check VAI interests were accrued before being fetched
    expect(fakeVaiControllerContract.callStatic.accrueVAIInterest).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });

  it('fetches and formats Prime distributions and Prime distribution simulations if user is Prime', async () => {
    const fakePrimeContract = {
      tokens: async () => fakePrimeContractResponses.tokens,
      MINIMUM_STAKED_XVS: async () => fakePrimeContractResponses.MINIMUM_STAKED_XVS,
      getAllMarkets: async () => fakePrimeContractResponses.getAllMarkets,
      estimateAPR: async () => fakePrimeContractResponses.estimateAPR,
      calculateAPR: async () => fakePrimeContractResponses.calculateAPR,
    } as unknown as Prime;

    const response = await getMainPool({
      blocksPerDay: 28800,
      name: 'Fake pool name',
      description: 'Fake pool description',
      xvs,
      vai,
      tokens,
      accountAddress: fakeAccountAddress,
      mainPoolComptrollerContract: fakeMainPoolComptrollerContract,
      venusLensContract: fakeVenusLensContract,
      vaiControllerContract: fakeVaiControllerContract,
      resilientOracleContract: fakeResilientOracleContract,
      primeContract: fakePrimeContract,
    });

    // Check VAI interests were accrued before being fetched
    expect(fakeVaiControllerContract.callStatic.accrueVAIInterest).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });

  it('does not fetch Prime distributions if user is not Prime', async () => {
    const fakePrimeContract = {
      tokens: async () => ({
        ...fakePrimeContractResponses.tokens,
        exists: false,
      }),
      MINIMUM_STAKED_XVS: async () => fakePrimeContractResponses.MINIMUM_STAKED_XVS,
      getAllMarkets: async () => fakePrimeContractResponses.getAllMarkets,
      estimateAPR: async () => fakePrimeContractResponses.estimateAPR,
      calculateAPR: async () => fakePrimeContractResponses.calculateAPR,
    } as unknown as Prime;

    const response = await getMainPool({
      blocksPerDay: 28800,
      name: 'Fake pool name',
      description: 'Fake pool description',
      xvs,
      vai,
      tokens,
      accountAddress: fakeAccountAddress,
      mainPoolComptrollerContract: fakeMainPoolComptrollerContract,
      venusLensContract: fakeVenusLensContract,
      vaiControllerContract: fakeVaiControllerContract,
      resilientOracleContract: fakeResilientOracleContract,
      primeContract: fakePrimeContract,
    });

    // Check VAI interests were accrued before being fetched
    expect(fakeVaiControllerContract.callStatic.accrueVAIInterest).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
