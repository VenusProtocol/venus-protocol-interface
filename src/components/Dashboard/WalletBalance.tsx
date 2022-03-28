import React from 'react';
import styled from 'styled-components';
import CircleProgressBar from 'components/Basic/CircleProgressBar';
import AnimatedNumber from 'animated-number-react';
import { Card } from 'components/Basic/Card';
import { Row, Column } from 'components/Basic/Style';
import Toggle from 'components/Basic/Toggle';
import { Label } from 'components/Basic/Label';
import { useWalletBalance } from '../../hooks/useWalletBalance';

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

function WalletBalance() {
  const { totalSupply, formatValue, netAPY, withXVS, setWithXVS, totalBorrow } = useWalletBalance();
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

export default WalletBalance;
