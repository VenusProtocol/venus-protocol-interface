import React, { useContext, useState } from 'react';
import { PrimaryButton } from 'components';
import NumberFormat from 'react-number-format';
import BigNumber from 'bignumber.js';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, TabContent } from 'components/Basic/BorrowModal';
import { getContractAddress } from 'utilities';
import { format } from 'utilities/common';
import { useVaiUser } from 'hooks/useVaiUser';
import { useTokenContract, useVaiUnitrollerContract } from 'clients/contracts/hooks';
import { AuthContext } from 'context/AuthContext';

function RepayVaiTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const { account } = useContext(AuthContext);
  const { userVaiMinted, userVaiBalance, userVaiEnabled } = useVaiUser();
  const vaiContract = useTokenContract('vai');
  const vaiControllerContract = useVaiUnitrollerContract();

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
      await vaiContract.methods
        .approve(
          getContractAddress('vaiUnitroller'),
          new BigNumber(2).pow(256).minus(1).toString(10),
        )
        .send({
          from: account?.address,
        });
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
        .repayVAI(amount.times(new BigNumber(10).pow(18)).dp(0).toString(10))
        .send({ from: account?.address });
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
              isAllowed={({ value }) =>
                new BigNumber(value || 0).isLessThanOrEqualTo(
                  BigNumber.minimum(userVaiBalance, userVaiMinted),
                )
              }
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
            <span>{format(userVaiMinted)} VAI</span>
          </div>
        </div>
        {(userVaiBalance.isZero() || amount.isGreaterThan(userVaiBalance)) && (
          <p className="center warning-label">Your balance is not enough.</p>
        )}
        {!userVaiEnabled ? (
          <PrimaryButton
            className="button"
            disabled={isLoading || userVaiBalance.isZero() || !account}
            onClick={() => {
              onVaiApprove();
            }}
            loading={isLoading}
          >
            Enable
          </PrimaryButton>
        ) : (
          <PrimaryButton
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
            loading={isLoading}
          >
            Repay VAI
          </PrimaryButton>
        )}
        <div className="description">
          <span>VAI Balance</span>
          <span>{format(userVaiBalance)} VAI</span>
        </div>
      </TabContent>
    </TabSection>
  );
}

export default RepayVaiTab;
