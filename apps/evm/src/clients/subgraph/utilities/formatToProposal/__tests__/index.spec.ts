import { chains } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import bscProposalsResponse from '__mocks__/subgraph/bscProposals.json';
import nonBscProposalsResponse from '__mocks__/subgraph/nonBscProposals.json';
import BigNumber from 'bignumber.js';
import type { ProposalsQuery } from 'clients/subgraph/gql/generated/governanceBsc';
import { governanceChainId } from 'libs/wallet';
import { formatToProposal } from '..';
import { getEstimateDateByBlockHeight } from '../getEstimateDateByBlockHeight';

describe('formatToProposal', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1710401645000));
  });

  it('returns proposal in the correct format', async () => {
    const res = formatToProposal({
      gqlProposal: bscProposalsResponse.proposals[0] as ProposalsQuery['proposals'][number],
      gqlRemoteProposalsMapping: nonBscProposalsResponse.proposals,
      currentBlockNumber: 41360384,
      proposalMinQuorumVotesMantissa: new BigNumber('1000000000000000000000'),
      accountAddress: fakeAccountAddress,
    });

    expect(res).toMatchSnapshot();
  });
});

describe('getEstimateDateByBlockHeight', () => {
  const { blockTimes = [] } = chains[governanceChainId] ?? {};
  const genesisBlockTime = blockTimes.find(
    item => item.blockTimeMs === 3000,
  ) as (typeof blockTimes)[number];

  const lorentzBlockTime = blockTimes.find(
    item => item.blockTimeMs === 1500,
  ) as (typeof blockTimes)[number];

  const maxwellBlockTime = blockTimes.find(
    item => item.blockTimeMs === 750,
  ) as (typeof blockTimes)[number];

  const fermiBlockTime = blockTimes.find(
    item => item.blockTimeMs === 450,
  ) as (typeof blockTimes)[number];

  // maxwell ->- target ->- current ->- fermi
  it('current time and target time (earlier) are both in the same block time range:', () => {
    const maxwellBlockHeight = 52552978;
    const nowDate = new Date('2025-05-26 07:05:16 AM UTC');
    vi.useFakeTimers().setSystemTime(nowDate);

    const currentBlock = maxwellBlockHeight + 20; // now: maxwell upgrade block + 20
    const targetBlock = maxwellBlockHeight + 10; // target: maxwell upgrade block + 10

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(nowDate.getTime() - maxwellBlockTime.blockTimeMs * 10);
  });

  //  target ->- maxwell ->- current
  it('current time and target time (eariler) are in different block time ranges (1 diff):', () => {
    const maxwellBlockHeight = 52552978;

    const currentBlock = maxwellBlockHeight + 10; // now: maxwell upgrade block + 10
    const targetBlock = maxwellBlockHeight - 10; // target: maxwell upgrade block - 10

    const nowDate = new Date(maxwellBlockTime.startTimestamp + 10 * maxwellBlockTime.blockTimeMs);
    vi.useFakeTimers().setSystemTime(nowDate);

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(
      nowDate.getTime() - maxwellBlockTime.blockTimeMs * 10 - lorentzBlockTime.blockTimeMs * 10,
    );
  });

  // target ->- lorentz ->- maxwell ->- current
  it('current time and target time (eariler) are across two block time ranges:', () => {
    const maxwellBlockHeight = 52552978;

    const currentBlock = maxwellBlockHeight + 10; // now: maxwell upgrade block + 10

    const lorentzEstimateHeight =
      maxwellBlockHeight -
      (maxwellBlockTime.startTimestamp - lorentzBlockTime.startTimestamp) /
        lorentzBlockTime.blockTimeMs;
    const targetBlock = lorentzEstimateHeight - 10; // target: estimated lorentz upgrade block - 10

    const nowDate = new Date(maxwellBlockTime.startTimestamp + 10 * maxwellBlockTime.blockTimeMs);
    vi.useFakeTimers().setSystemTime(nowDate);

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(
      nowDate.getTime() -
        maxwellBlockTime.blockTimeMs * 10 -
        lorentzBlockTime.blockTimeMs * (maxwellBlockHeight - lorentzEstimateHeight) -
        genesisBlockTime.blockTimeMs * 10,
    );
  });

  // target ->- maxwell ->- fermi ->- current
  it('current time (later after fermi) and target time (eariler) are across two block time ranges:', () => {
    const maxwellBlockHeight = 49791365;

    const fermiEstimateHeight =
      maxwellBlockHeight +
      (fermiBlockTime.startTimestamp - maxwellBlockTime.startTimestamp) /
        maxwellBlockTime.blockTimeMs;

    const currentBlock = fermiEstimateHeight + 10; // now: estimated fermi upgrade block + 10

    const targetBlock = maxwellBlockHeight - 10; // target: maxwell upgrade block - 10

    const nowDate = new Date(fermiBlockTime.startTimestamp + 10 * fermiBlockTime.blockTimeMs);
    vi.useFakeTimers().setSystemTime(nowDate);

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(
      nowDate.getTime() -
        fermiBlockTime.blockTimeMs * 10 -
        maxwellBlockTime.blockTimeMs * (fermiEstimateHeight - maxwellBlockHeight) -
        lorentzBlockTime.blockTimeMs * 10,
    );
  });

  // maxwell ->- current ->- target -> fermi
  it('current time and target time (later) are both in the same block time range:', () => {
    const maxwellBlockHeight = 52552978;
    const nowDate = new Date('2025-05-26 07:05:08 AM UTC');
    vi.useFakeTimers().setSystemTime(nowDate);

    const currentBlock = maxwellBlockHeight + 10; // now: maxwell upgrade block + 10
    const targetBlock = maxwellBlockHeight + 20; // target: maxwell upgrade block + 20

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(nowDate.getTime() + maxwellBlockTime.blockTimeMs * 10);
  });

  // lorentz ->- current ->- maxwell ->- target
  it('current time and target time (later) are in different block time ranges (1 diff):', () => {
    const maxwellBlockHeight = 52552978;

    const currentBlock = maxwellBlockHeight - 10; // now: maxwell upgrade block - 10
    const targetBlock = maxwellBlockHeight + 10; // target: maxwell upgrade block + 10

    const nowDate = new Date(maxwellBlockTime.startTimestamp - 10 * lorentzBlockTime.blockTimeMs);
    vi.useFakeTimers().setSystemTime(nowDate);

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(
      nowDate.getTime() + maxwellBlockTime.blockTimeMs * 10 + lorentzBlockTime.blockTimeMs * 10,
    );
  });

  // current ->- lorentz ->- maxwell ->- target
  it('current time and target time (later) are across two block time ranges:', () => {
    const lorentzBlockHeight = 49791365;

    const currentBlock = lorentzBlockHeight - 10; // now: lorentz upgrade block - 10

    const maxwellEstimateHeight =
      lorentzBlockHeight +
      (maxwellBlockTime.startTimestamp - lorentzBlockTime.startTimestamp) /
        lorentzBlockTime.blockTimeMs;

    const targetBlock = maxwellEstimateHeight + 10; // target: estimated maxwell upgrade block + 10

    const nowDate = new Date(lorentzBlockTime.startTimestamp - 10 * genesisBlockTime.blockTimeMs);
    vi.useFakeTimers().setSystemTime(nowDate);

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(
      nowDate.getTime() +
        maxwellBlockTime.blockTimeMs * 10 +
        lorentzBlockTime.blockTimeMs * (maxwellEstimateHeight - lorentzBlockHeight) +
        genesisBlockTime.blockTimeMs * 10,
    );
  });

  // lorentz ->- current ->- maxwell ->- fermi ->- target
  it('current time and target time (later after Fermi) are across two block time ranges:', () => {
    const maxwellBlockHeight = 49791365;

    const currentBlock = maxwellBlockHeight - 10; // now: maxwell upgrade block - 10

    const fermiEstimateHeight =
      maxwellBlockHeight +
      (fermiBlockTime.startTimestamp - maxwellBlockTime.startTimestamp) /
        maxwellBlockTime.blockTimeMs;

    const targetBlock = fermiEstimateHeight + 10; // target: estimated fermi upgrade block + 10

    const nowDate = new Date(maxwellBlockTime.startTimestamp - 10 * lorentzBlockTime.blockTimeMs);
    vi.useFakeTimers().setSystemTime(nowDate);

    const estimateTime = getEstimateDateByBlockHeight(targetBlock, currentBlock, blockTimes);

    expect(estimateTime).toBeCloseTo(
      nowDate.getTime() +
        fermiBlockTime.blockTimeMs * 10 +
        maxwellBlockTime.blockTimeMs * (fermiEstimateHeight - maxwellBlockHeight) +
        lorentzBlockTime.blockTimeMs * 10,
    );
  });
});
