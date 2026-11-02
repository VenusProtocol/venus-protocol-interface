import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { renderHook } from 'testUtils/render';
import type { AssetBalanceMutation } from 'types';

import { useFormValidation } from '..';

const pool = poolData[0];

const riskyWithdrawal: AssetBalanceMutation = {
  type: 'asset',
  vTokenAddress: pool.assets[0].vToken.address,
  action: 'withdraw',
  amountTokens: new BigNumber(1),
};

const renderValidation = (acknowledgeRisk: boolean) =>
  renderHook(() =>
    useFormValidation({
      liquidityHub: liquidityHubs[0],
      formValues: { amountTokens: '1', acknowledgeRisk },
      balanceMutations: [riskyWithdrawal],
      limitTokens: new BigNumber(1000),
      pool,
      simulatedPool: { ...pool, userHealthFactor: 1.2 },
    }),
  ).result.current;

describe('useFormValidation', () => {
  it('requires the user to acknowledge a risky Core withdrawal', () => {
    expect(renderValidation(false).formError?.code).toBe('REQUIRES_RISK_ACKNOWLEDGEMENT');
  });

  it('accepts a risky Core withdrawal once the user acknowledges the risk', () => {
    expect(renderValidation(true).formError?.code).not.toBe('REQUIRES_RISK_ACKNOWLEDGEMENT');
  });
});
