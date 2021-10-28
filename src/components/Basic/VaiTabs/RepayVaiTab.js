import React, { useState } from 'react';
import { Icon } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, TabContent } from 'components/Basic/BorrowModal';
import { useWeb3React } from '@web3-react/core';
import { useVaiUser } from '../../../hooks/useVaiUser';
import { getVaiUnitrollerAddress } from '../../../utilities/addressHelpers';
import { useVaiToken, useVaiUnitroller } from '../../../hooks/useContract';

const format = commaNumber.bindWith(',', '.');

function RepayVaiTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const { account } = useWeb3React();
  const { userVaiMinted, userVaiBalance, userVaiEnabled } = useVaiUser();
  const vaiContract = useVaiToken();
  const vaiControllerContract = useVaiUnitroller();

  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    setAmount(BigNumber.minimum(userVaiMinted, userVaiBalance));
  };

  /**
   * Approve VAI token
   */
  const onVaiApprove = async () => {
    setIsLoading(true);
    try {
      await vaiContract.methods.approve(
        getVaiUnitrollerAddress(),
        new BigNumber(2)
          .pow(256)
          .minus(1)
          .toString(10)
      );
    } catch (error) {
      console.log('vai approve error :>> ', error);
    }
    setIsLoading(false);
  };

  /**
   * Repay VAI
   */
  const handleRepayVAI = async () => {
    setIsLoading(true);
    try {
      await vaiControllerContract.methods
        .repayVAI(
          amount
            .times(new BigNumber(10).pow(18))
            .dp(0)
            .toString(10)
        )
        .send({ from: account });
      setAmount(new BigNumber(0));
    } catch (error) {
      console.log('repay vai error :>> ', error);
    }
    setIsLoading(false);
  };

  return (
    <TabSection>
      <div className="flex flex-column align-center just-center body-content repay-vai-content">
        {userVaiEnabled ? (
          <div className="flex align-center input-wrapper">
            <NumberFormat
              autoFocus
              value={amount.isZero() ? '0' : amount.toString(10)}
              onValueChange={({ value }) => {
                setAmount(new BigNumber(value));
              }}
              isAllowed={({ value }) => {
                return new BigNumber(value || 0).isLessThanOrEqualTo(
                  BigNumber.minimum(userVaiBalance, userVaiMinted)
                );
              }}
              thousandSeparator
              allowNegative={false}
              placeholder="0"
            />
            <span className="pointer max" onClick={() => handleMaxAmount()}>
              MAX
            </span>
          </div>
        ) : (
          <>
            <img src={vaiImg} alt="asset" />
            <p className="center warning-label">
              To repay VAI to the Venus Protocol, you need to approve it first.
            </p>
          </>
        )}
      </div>
      <TabContent className="flex flex-column align-center just-content vai-content-section">
        <div className="flex flex-column just-center align-center apy-content">
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={vaiImg} alt="asset" />
              <div className="vai-balance">
                <span>Repay VAI</span>
                <span>Balance</span>
              </div>
            </div>
            <span>{format(userVaiMinted.dp(2, 1).toString(10))} VAI</span>
          </div>
        </div>
        {(userVaiBalance.isZero() || amount.isGreaterThan(userVaiBalance)) && (
          <p className="center warning-label">Your balance is not enough.</p>
        )}
        {!userVaiEnabled ? (
          <Button
            className="button"
            disabled={isLoading || userVaiBalance.isZero() || !account}
            onClick={() => {
              onVaiApprove();
            }}
          >
            {isLoading && <Icon type="loading" />} Enable
          </Button>
        ) : (
          <Button
            className="button vai-auto"
            disabled={
              isLoading ||
              !account ||
              amount.isNaN() ||
              amount.isZero() ||
              amount.isGreaterThan(userVaiMinted) ||
              amount.isGreaterThan(userVaiBalance)
            }
            onClick={handleRepayVAI}
          >
            {isLoading && <Icon type="loading" />} Repay VAI
          </Button>
        )}
        <div className="description">
          <span>VAI Balance</span>
          <span>{format(userVaiBalance.dp(2, 1).toString(10))} VAI</span>
        </div>
      </TabContent>
    </TabSection>
  );
}

export default RepayVaiTab;
