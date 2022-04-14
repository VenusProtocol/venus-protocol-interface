import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CircleProgressBar from 'components/Basic/CircleProgressBar';
import BigNumber from 'bignumber.js';
import AnimatedNumber from 'animated-number-react';
import { useWeb3Account } from 'clients/web3';
import { accountActionCreators } from 'core/modules/account/actions';
import { Card } from 'components/Basic/Card';
import { Row, Column } from 'components/Basic/Style';
import { getBigNumber, format } from 'utilities/common';
import Toggle from 'components/Basic/Toggle';
import { Label } from 'components/Basic/Label';
import { Setting } from 'types';
import { State } from 'core/modules/initialState';
import { useVaiUser } from '../../hooks/useVaiUser';
import { useMarketsUser } from '../../hooks/useMarketsUser';
import { useVaiVaultContract } from '../../clients/contracts/hooks';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 35px;

  .label {
    font-size: 20px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  .value {
    font-size: 25px;
    font-weight: 900;
    color: var(--color-text-main);
    margin-top: 44px;
  }

  .apy-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;

    .toggel-label {
      margin-top: 15px;
      .emoji {
        color: transparent;
        text-shadow: 0 0 0 grey;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .label {
      font-size: 16px;
    }
    .value {
      font-size: 20px;
    }
  }

  @media only screen and (max-width: 1280px) {
    .label {
      font-size: 16px;
    }
    .value {
      font-size: 20px;
    }
  }
`;

const BalancerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

interface WalletBalanceProps {
  settings: Setting;
  setSetting: (setting: Partial<Setting> | undefined) => void;
}

function WalletBalance({ settings, setSetting }: WalletBalanceProps) {
  const [netAPY, setNetAPY] = useState(0);
  const [withXVS, setWithXVS] = useState(true);
  const { userVaiMinted } = useVaiUser();
  const { userMarketInfo } = useMarketsUser();

  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBorrow, setTotalBorrow] = useState(new BigNumber(0));
  const { account } = useWeb3Account();
  const vaultContract = useVaiVaultContract();

  let isMounted = true;

  const addVAIApy = useCallback(
    async apy => {
      if (!account) {
        return;
      }
      const { 0: staked } = await vaultContract.methods.userInfo(account).call();
      const amount = new BigNumber(staked).div(1e18);

      if (!isMounted) {
        return;
      }

      if (amount.isNaN() || amount.isZero()) {
        setNetAPY(apy.dp(2, 1).toNumber());
      } else {
        setNetAPY(apy.plus(settings.vaiAPY).dp(2, 1).toNumber());
      }
    },
    [settings],
  );

  const updateNetAPY = useCallback(async () => {
    let totalSum = new BigNumber(0);
    let totalSupplied = new BigNumber(0);
    let totalBorrowed = userVaiMinted;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type '{}'.
    userMarketInfo.forEach((asset: Asset) => {
      if (!asset) return;
      const {
        supplyBalance,
        borrowBalance,
        tokenPrice,
        supplyApy,
        borrowApy,
        xvsSupplyApy,
        xvsBorrowApy,
      } = asset;
      const supplyBalanceUSD = getBigNumber(supplyBalance).times(getBigNumber(tokenPrice));
      const borrowBalanceUSD = getBigNumber(borrowBalance).times(getBigNumber(tokenPrice));
      totalSupplied = totalSupplied.plus(supplyBalanceUSD);
      totalBorrowed = totalBorrowed.plus(borrowBalanceUSD);

      const supplyApyWithXVS = withXVS
        ? getBigNumber(supplyApy).plus(getBigNumber(xvsSupplyApy))
        : getBigNumber(supplyApy);
      const borrowApyWithXVS = withXVS
        ? getBigNumber(xvsBorrowApy).plus(getBigNumber(borrowApy))
        : getBigNumber(borrowApy);

      // const supplyApyWithXVS = getBigNumber(supplyApy);
      // const borrowApyWithXVS = getBigNumber(borrowApy).times(-1);
      totalSum = totalSum.plus(
        supplyBalanceUSD
          .times(supplyApyWithXVS.div(100))
          .plus(borrowBalanceUSD.times(borrowApyWithXVS.div(100))),
      );
    });

    let apy;

    if (totalSum.isZero() || totalSum.isNaN()) {
      apy = new BigNumber(0);
    } else if (totalSum.isGreaterThan(0)) {
      apy = totalSupplied.isZero() ? 0 : totalSum.div(totalSupplied).times(100);
    } else {
      apy = totalBorrowed.isZero() ? 0 : totalSum.div(totalBorrowed).times(100);
    }
    if (!isMounted) {
      return;
    }
    setTotalSupply(totalSupplied);
    setTotalBorrow(totalBorrowed);
    addVAIApy(apy);
  }, [userMarketInfo, withXVS]);

  useEffect(() => {
    if (account && userMarketInfo && userMarketInfo.length > 0) {
      updateNetAPY();
    }
    return () => {
      isMounted = false;
    };
  }, [account, updateNetAPY]);

  useEffect(() => {
    if (isMounted) {
      setSetting({
        withXVS,
      });
    }
    return () => {
      isMounted = false;
    };
  }, [withXVS]);

  const formatValue = (value: $TSFixMe) => `$${format(getBigNumber(value))}`;

  return (
    <Card>
      <CardWrapper className="flex just-between">
        <Row>
          <Column xs="12" sm="4">
            <BalancerWrapper>
              <p className="label">Supply Balance</p>
              <p className="value">
                <AnimatedNumber
                  value={totalSupply.dp(2, 1).toString(10)}
                  formatValue={formatValue}
                  duration={2000}
                />
              </p>
            </BalancerWrapper>
          </Column>
          <Column xs="12" sm="4">
            <CircleProgressBar percent={netAPY} width={150} label="Net APY" />
            <div className="apy-toggle">
              <Toggle checked={withXVS} onChecked={() => setWithXVS(!withXVS)} />
              <Label size="14" primary className="toggel-label">
                {withXVS ? (
                  '🔥 APY with XVS'
                ) : (
                  <div>
                    <span className="emoji" role="img" aria-label="information">
                      🔥
                    </span>
                    APY without XVS
                  </div>
                )}
              </Label>
            </div>
          </Column>
          <Column xs="12" sm="4">
            <BalancerWrapper>
              <p className="label">Borrow Balance</p>
              <p className="value">
                <AnimatedNumber
                  value={totalBorrow.dp(2, 1).toString(10)}
                  formatValue={formatValue}
                  duration={2000}
                />
              </p>
            </BalancerWrapper>
          </Column>
        </Row>
      </CardWrapper>
    </Card>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(WalletBalance);
