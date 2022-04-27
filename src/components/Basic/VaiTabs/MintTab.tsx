import React, { useState, useEffect, useCallback, useContext } from 'react';
import BigNumber from 'bignumber.js';
import { PrimaryButton } from 'components';
import NumberFormat from 'react-number-format';
import feeImg from 'assets/img/fee.png';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, TabContent } from 'components/Basic/SupplyModal';
import { format } from 'utilities/common';
import { useVaiUser } from 'hooks/useVaiUser';
import { useMarketsUser } from 'hooks/useMarketsUser';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';
import { AuthContext } from 'context/AuthContext';

function MintTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [feePercent, setFeePercent] = useState(new BigNumber(0));
  const { account } = useContext(AuthContext);
  const { userVaiBalance, mintableVai } = useVaiUser();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  const vaiControllerContract = useVaiUnitrollerContract();

  const getFeePercent = useCallback(async () => {
    const treasuryPercent = await vaiControllerContract.methods.treasuryPercent().call();
    setFeePercent(new BigNumber(treasuryPercent).times(100).div(1e18));
  }, [vaiControllerContract]);

  useEffect(() => {
    getFeePercent();
  }, [getFeePercent]);

  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    const safeMax = BigNumber.maximum(
      userTotalBorrowLimit.times(40).div(100).minus(userTotalBorrowBalance),
      new BigNumber(0),
    );
    setAmount(BigNumber.minimum(mintableVai, safeMax));
  };
  /**
   * Mint
   */
  const handleMintVAI = async () => {
    setIsLoading(true);
    try {
      await vaiControllerContract.methods
        .mintVAI(amount.times(new BigNumber(10).pow(18)).dp(0).toString(10))
        .send({ from: account?.address });
      setAmount(new BigNumber(0));
    } catch (error) {
      console.log('mint vai error :>> ', error);
    }
    setIsLoading(false);
  };

  return (
    <TabSection>
      <div className="flex flex-column align-center just-center body-content mint-vai-content">
        <div className="flex align-center input-wrapper">
          <NumberFormat
            autoFocus
            value={amount.isZero() ? '0' : amount.toString(10)}
            onValueChange={({ value }) => {
              setAmount(new BigNumber(value));
            }}
            isAllowed={({ value }) => new BigNumber(value || 0).isLessThanOrEqualTo(mintableVai)}
            thousandSeparator
            allowNegative={false}
            placeholder="0"
          />
          <span className="pointer max" onClick={() => handleMaxAmount()}>
            SAFE MAX
          </span>
        </div>
      </div>
      <TabContent className="flex flex-column align-center just-content vai-content-section">
        <div className="flex flex-column just-center align-center apy-content">
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={vaiImg} alt="asset" />
              <div className="vai-balance">
                <span>Available VAI</span>
                <span>Limit</span>
              </div>
            </div>
            <span>{format(mintableVai)} VAI</span>
          </div>
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={feeImg} alt="asset" />
              <div className="vai-balance">
                <span>Mint Fee</span>
              </div>
            </div>
            <span>
              {!amount.isNaN()
                ? new BigNumber(amount)
                    // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                    .times(feePercent / 100)
                    .dp(4)
                    .toString(10)
                : 0}{' '}
              VAI ({feePercent.toString(10)}
              %)
            </span>
          </div>
        </div>
        <PrimaryButton
          className="button vai-auto"
          disabled={
            isLoading ||
            !account ||
            amount.isNaN() ||
            amount.isZero() ||
            amount.isGreaterThan(mintableVai)
          }
          onClick={handleMintVAI}
          loading={isLoading}
        >
          Mint VAI
        </PrimaryButton>
        <div className="description">
          <span>VAI Balance</span>
          <span>{format(userVaiBalance)} VAI</span>
        </div>
      </TabContent>
    </TabSection>
  );
}

export default MintTab;
